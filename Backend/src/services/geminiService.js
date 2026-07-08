const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lazy-initialize the Gemini client to ensure dotenv has loaded
let genAI = null;
const getGenAI = () => {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

/**
 * Generates a human-readable summary of multiple feedback texts using Gemini AI
 * @param {string[]} feedbackTexts - Array of feedback strings from users
 * @returns {string} - A 3-5 sentence summary from Gemini
 */
const generateSummary = async (feedbackTexts) => {
    // Guard: ensure we have something to summarize
    if (!feedbackTexts || feedbackTexts.length === 0) {
        throw new Error('No feedback texts provided to summarize');
    }

    // Format the feedback list as a numbered list for the prompt
    const feedbackList = feedbackTexts
        .map((text, index) => `${index + 1}. "${text}"`)
        .join('\n');

    // Build the prompt we send to Gemini
    const prompt = `Here are ${feedbackTexts.length} user feedback comments about a product:

${feedbackList}

Write a short 3-5 sentence summary highlighting:
- The main problems or pain points users are facing
- What users appreciate or find positive about the product

Be concise, specific, and write in plain language as if reporting to a product manager.
Do not use bullet points. Write as a paragraph.`;

    try {
        // Use the free-tier compatible Gemini 1.5 Flash model
        const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Send the prompt to Gemini
        const result = await model.generateContent(prompt);

        // Extract the text from Gemini's response
        const response = result.response;
        const summaryText = response.text();

        return summaryText;

    } catch (error) {
        // Handle specific Gemini API error types
        if (error.message && error.message.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Gemini API Key. Please check your GEMINI_API_KEY in .env');
        }
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('Gemini API rate limit hit. Please wait a moment and try again.');
        }
        // Re-throw any other errors
        throw new Error(`Gemini API Error: ${error.message}`);
    }
};

module.exports = { generateSummary };
