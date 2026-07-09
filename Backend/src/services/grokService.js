/**
 * Service to interface with xAI's Grok API for feedback summarization.
 */

/**
 * Generates a STRUCTURED summary of multiple feedback texts using Grok AI.
 * Returns an object with:
 *   - summary: a 3-5 sentence paragraph
 *   - keyProblems: array of { problem, severity } objects
 *
 * @param {string[]} feedbackTexts - Array of feedback strings from users
 * @returns {{ summary: string, keyProblems: Array<{ problem: string, severity: string }> }}
 */
const generateSummary = async (feedbackTexts) => {
    if (!feedbackTexts || feedbackTexts.length === 0) {
        throw new Error('No feedback texts provided to summarize');
    }

    // Format the feedback list as a numbered list
    const feedbackList = feedbackTexts
        .map((text, index) => `${index + 1}. "${text}"`)
        .join('\n');

    const prompt = `You are an expert product analyst. Here are ${feedbackTexts.length} user feedback comments about a product:

${feedbackList}

Analyze these feedback entries and respond ONLY with valid JSON (no markdown fences, no extra text). Use this exact structure:

{
  "summary": "A 3-5 sentence paragraph summarizing the overall sentiment, common themes, main pain points, and any positives users mention. Write in plain language as if reporting to a product manager.",
  "keyProblems": [
    { "problem": "Short description of a specific issue users are facing", "severity": "high" },
    { "problem": "Another issue", "severity": "medium" },
    { "problem": "A minor issue", "severity": "low" }
  ]
}

Rules:
- severity must be one of: "high", "medium", "low"
- Include 2-6 key problems based on what users mention
- high = critical/blocking issues, medium = annoying but workable, low = minor complaints
- If feedback is mostly positive, still identify areas for improvement
- Respond with ONLY the JSON object, nothing else`;

    try {
        if (!process.env.GROK_API_KEY) {
            throw new Error('GROK_API_KEY is not set in environment variables');
        }

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-2',
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            throw new Error(`xAI API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content;

        if (!rawText) {
            throw new Error('Empty response from Grok API');
        }

        try {
            let cleanedText = rawText.trim();
            if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText
                    .replace(/^```(?:json)?\s*\n?/, '')  // Remove opening fence
                    .replace(/\n?\s*```$/, '');            // Remove closing fence
            }

            const parsed = JSON.parse(cleanedText);

            return {
                summary: parsed.summary || rawText,
                keyProblems: Array.isArray(parsed.keyProblems) ? parsed.keyProblems : []
            };
        } catch (parseError) {
            console.warn('Grok response was not valid JSON, using raw text as summary:', parseError.message);
            return {
                summary: rawText,
                keyProblems: []
            };
        }

    } catch (error) {
        throw new Error(`Grok API Error: ${error.message}`);
    }
};

module.exports = { generateSummary };
