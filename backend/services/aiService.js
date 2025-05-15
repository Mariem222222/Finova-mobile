const axios = require("axios");
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function getGroqRecommendation(prompt) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const body = {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "user",
        content: prompt + "\n\nIMPORTANT: Return ONLY a valid JSON array of recommendation objects with title, detail, actionItems, and category. No markdown formatting or additional text."
      }
    ],
    temperature: 0.5, // Reduced for more consistent formatting
    top_p: 0.9,
    max_tokens: 1024,
    response_format: { type: "json_object" } // Enforce JSON output
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      }
    });

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq API');
    }

    let responseText = response.data.choices[0].message.content;
    
    // Clean response - remove markdown code blocks
    responseText = responseText.replace(/```json|```/g, '').trim();

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    
    // Validate and transform the response structure
    const cards = Array.isArray(parsed) 
      ? parsed 
      : parsed.cards || parsed.recommendations || [];

    // Normalize the response format
    return cards.map(card => ({
      title: card.title || "Financial Recommendation",
      detail: card.detail || card.description || "",
      actionItems: Array.isArray(card.actionItems) 
        ? card.actionItems 
        : [card.actionItem || "Review your financial habits"],
      category: card.category || "General"
    })).filter(card => 
      card.title && card.detail && card.actionItems.length > 0
    );

  } catch (error) {
    console.error("Groq API Error:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    // Return safe default recommendations
    return [{
      title: "Financial Health Basics",
      detail: "Start by tracking your monthly expenses and income",
      actionItems: ["Review bank statements", "Categorize expenses"],
      category: "General"
    }];
  }
}

// Retry with exponential backoff
async function getWithRetry(prompt, retries = 3, delay = 1000) {
  try {
    return await getGroqRecommendation(prompt);
  } catch (error) {
    if (retries > 0 && error.response?.status !== 400) {
      await new Promise(res => setTimeout(res, delay));
      return getWithRetry(prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

module.exports = { getGroqRecommendation, getWithRetry };