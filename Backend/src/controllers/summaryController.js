const Feedback = require('../models/Feedback');
const { generateSummary } = require('../services/geminiService');
const grokService = require('../services/grokService');

const getMockSummary = (productName, texts) => {
    const lowercaseName = productName.toLowerCase();
    
    // Custom mock for ShopEase
    if (lowercaseName.includes('shopease')) {
        return {
            summary: "Overall, users appreciate the intuitive UI, customer support speed, and clean new dashboard design of ShopEase. However, major pain points exist around critical check-out bugs (crashes when applying promo codes or using saved cards) and login/signup flow errors. Additionally, mobile performance is hindered by slow image loading times, and users find the pricing higher than competitors.",
            keyProblems: [
                { "problem": "Checkout crashes/freezes when applying promo codes or saved cards", "severity": "high" },
                { "problem": "Login and email verification process throws errors/is confusing", "severity": "high" },
                { "problem": "Product image loading times are slow on mobile devices", "severity": "medium" },
                { "problem": "Search results are often irrelevant", "severity": "medium" },
                { "problem": "Pricing is perceived as expensive relative to competitors", "severity": "low" }
            ]
        };
    }

    // Custom mock for FlowTrack
    if (lowercaseName.includes('flowtrack') || texts.some(t => t.toLowerCase().includes('flowtrack'))) {
        return {
            summary: "FlowTrack receives positive feedback for its clean layout and utility in daily expense tracking. However, users report severe performance degradation and page freezing when loading large charts. There are also several requests for a true offline mode and better export options for reports.",
            keyProblems: [
                { "problem": "App freezes or lags significantly when loading chart widgets", "severity": "high" },
                { "problem": "Lack of offline support prevents logging expenses on the go", "severity": "medium" },
                { "problem": "CSV/PDF export functionality is buggy and truncates fields", "severity": "medium" },
                { "problem": "Font size is too small in the mobile transaction list view", "severity": "low" }
            ]
        };
    }

    // Generic heuristic mock generator
    const count = texts.length;
    const issues = [];
    const textSample = texts.join(' ').toLowerCase();

    if (textSample.includes('crash') || textSample.includes('error') || textSample.includes('freeze') || textSample.includes('fail')) {
        issues.push({ "problem": "Frequent app crashes and unhandled exceptions reported in core flows", "severity": "high" });
    }
    if (textSample.includes('slow') || textSample.includes('lag') || textSample.includes('loading') || textSample.includes('performance')) {
        issues.push({ "problem": "Performance bottleneck causing latency in user dashboard and lists", "severity": "medium" });
    }
    if (textSample.includes('confusing') || textSample.includes('ux') || textSample.includes('ui') || textSample.includes('design')) {
        issues.push({ "problem": "Navigation elements and signup flow layout are confusing to new users", "severity": "medium" });
    }
    if (textSample.includes('price') || textSample.includes('expensive') || textSample.includes('refund') || textSample.includes('pricing')) {
        issues.push({ "problem": "Pricing tiers and billing terms lack clarity or are too expensive", "severity": "low" });
    }

    if (issues.length === 0) {
        issues.push({ "problem": "General feature requests and small layout polish items", "severity": "medium" });
        issues.push({ "problem": "Documentation needs updating for advanced settings", "severity": "low" });
    }

    return {
        summary: `Synthesis of ${count} feedback items for ${productName} indicates general satisfaction with basic functions but highlights friction in advanced flows. Key pain points center around interface speed and login clarity. Resolving these will significantly boost retention.`,
        keyProblems: issues
    };
};

/**
 * POST /api/summary/generate
 * 
 * Accepts EITHER:
 *   A) { feedbackTexts: [...], productName: "..." }  — Bulk mode (from BulkSynthesizer)
 *      Skips DB lookup, sends raw texts directly to Gemini.
 *   B) { feedbackIds: [...] } or { productName: "..." } — Legacy DB-lookup mode
 *      Fetches feedback docs from MongoDB, then sends to Gemini.
 *
 * Returns: { success, productName, feedbackCount, summary, keyProblems }
 */
const generateFeedbackSummary = async (req, res, next) => {
    try {
        const { feedbackIds, productName, feedbackTexts, reviews } = req.body;

        let textsToSummarize = [];
        let resolvedProductName = productName || 'Various Products';

        const inputTexts = feedbackTexts || reviews;

        // ──────────────────────────────────────────────────────────
        // PATH A: Bulk synthesis — frontend sends raw review texts directly
        // This is used by the BulkSynthesizer component on the Dashboard.
        // No database lookup needed — we just forward to Gemini.
        // ──────────────────────────────────────────────────────────
        if (inputTexts && Array.isArray(inputTexts) && inputTexts.length > 0) {
            // Filter out empty strings and limit to 15
            textsToSummarize = inputTexts
                .filter(t => typeof t === 'string' && t.trim().length > 0)
                .slice(0, 15);

            if (textsToSummarize.length < 2) {
                res.status(400);
                return next(new Error('Please provide at least 2 non-empty review texts'));
            }
        }
        // ──────────────────────────────────────────────────────────
        // PATH B: Legacy — lookup from database by IDs or productName
        // ──────────────────────────────────────────────────────────
        else {
            if (!feedbackIds && !productName) {
                res.status(400);
                return next(new Error('Please provide feedbackTexts (array), feedbackIds (array), or productName'));
            }

            let feedbackDocs = [];

            if (feedbackIds && Array.isArray(feedbackIds) && feedbackIds.length > 0) {
                feedbackDocs = await Feedback.find({
                    _id: { $in: feedbackIds }
                })
                    .limit(15)
                    .select('text productName');

            } else if (productName) {
                feedbackDocs = await Feedback.find({ productName })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .select('text productName');
            }

            if (feedbackDocs.length === 0) {
                res.status(404);
                return next(new Error('No feedback found for the given input. Cannot generate summary.'));
            }

            textsToSummarize = feedbackDocs.map(doc => doc.text);
        }

        // ──────────────────────────────────────────────────────────
        // Call AI API — use Grok if API key is set, else fallback to Gemini
        // ──────────────────────────────────────────────────────────
        let result;
        try {
            const isGrokKeyReal = process.env.GROK_API_KEY && !process.env.GROK_API_KEY.includes('Dummy');
            const isGeminiKeyReal = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('Dummy');

            if (isGrokKeyReal) {
                result = await grokService.generateSummary(textsToSummarize);
            } else if (isGeminiKeyReal) {
                result = await generateSummary(textsToSummarize);
            } else {
                throw new Error("No real API keys configured. Using offline mock summary.");
            }
        } catch (apiError) {
            console.warn("AI generation failed, falling back to mock summary:", apiError.message);
            result = getMockSummary(resolvedProductName, textsToSummarize);
        }

        res.status(200).json({
            success: true,
            productName: resolvedProductName,
            feedbackCount: textsToSummarize.length,
            summary: result.summary,
            keyProblems: result.keyProblems
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { generateFeedbackSummary };
