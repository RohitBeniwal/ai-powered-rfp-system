const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

/**
 * Generate completion from Ollama
 */
async function generateCompletion(prompt, systemPrompt = '') {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9
      }
    });

    return response.data.response;
  } catch (error) {
    console.error('Ollama API error:', error.message);
    throw new Error('Failed to generate AI response. Make sure Ollama is running.');
  }
}

/**
 * Convert natural language description to structured RFP
 */
async function parseRFPFromDescription(description) {
  const systemPrompt = `You are an AI assistant that converts natural language procurement requests into structured RFP (Request for Proposal) data.

Extract the following information from the user's description and return ONLY valid JSON (no markdown, no explanations):
- title: A short, descriptive title for the RFP
- items: Array of items/services being requested with quantities
- budget: The budget amount (keep original currency format)
- deadline: Delivery deadline or timeframe
- requirements: Array of specific requirements (specs, warranty, terms, etc.)
- payment_terms: Payment terms if mentioned
- additional_notes: Any other relevant information

If information is not provided, use reasonable defaults or null.`;

  const prompt = `Convert this procurement request into structured JSON:\n\n"${description}"`;

  try {
    const response = await generateCompletion(prompt, systemPrompt);
    
    // Extract JSON from response (handle cases where AI includes markdown or extra text)
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }
    
    // Parse and validate JSON
    const parsed = JSON.parse(jsonStr);
    
    return parsed;
  } catch (error) {
    console.error('Error parsing RFP:', error.message);
    throw new Error('Failed to parse RFP from description');
  }
}

/**
 * Parse vendor response to extract structured data
 */
async function parseVendorResponse(responseText) {
  const systemPrompt = `You are an AI assistant that extracts structured information from vendor proposal responses.

Extract the following from the vendor's response and return ONLY valid JSON (no markdown):
- vendor_name: Vendor or company name if mentioned
- pricing: Price information (per unit and/or total)
- delivery_time: Delivery timeframe or date
- warranty: Warranty terms
- payment_terms: Payment terms if mentioned
- technical_specs: Any technical specifications mentioned
- additional_terms: Any other important terms or conditions
- confidence_score: Your confidence in the extraction (0-100)

If information is not clearly stated, use null for that field.`;

  const prompt = `Extract structured data from this vendor response:\n\n"${responseText}"`;

  try {
    const response = await generateCompletion(prompt, systemPrompt);
    
    // Extract JSON from response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }
    
    const parsed = JSON.parse(jsonStr);
    
    return parsed;
  } catch (error) {
    console.error('Error parsing vendor response:', error.message);
    throw new Error('Failed to parse vendor response');
  }
}

/**
 * Compare multiple proposals and generate recommendation
 */
async function compareProposals(rfpData, proposals) {
  const systemPrompt = `You are an AI procurement analyst. Compare the given vendor proposals and provide a comprehensive analysis.

Provide your analysis in this JSON format (no markdown):
{
  "summary": "Brief overview of all proposals",
  "comparison": {
    "best_price": "Which vendor offers best pricing",
    "fastest_delivery": "Which vendor has fastest delivery",
    "best_warranty": "Which vendor has best warranty terms",
    "best_overall_value": "Which vendor offers best overall value"
  },
  "vendor_rankings": [
    {
      "vendor": "vendor name",
      "score": 0-100,
      "pros": ["list of advantages"],
      "cons": ["list of disadvantages"]
    }
  ],
  "recommendation": "Which vendor to choose and why (2-3 sentences)",
  "key_considerations": ["Important factors to consider before final decision"]
}`;

  const proposalsText = proposals.map((p, idx) => {
    const data = typeof p.parsed_data === 'string' ? JSON.parse(p.parsed_data) : p.parsed_data;
    return `Proposal ${idx + 1} (${p.vendor_name}):\n${JSON.stringify(data, null, 2)}`;
  }).join('\n\n');

  const prompt = `RFP Requirements:\n${JSON.stringify(rfpData, null, 2)}\n\nVendor Proposals:\n${proposalsText}\n\nProvide a detailed comparison and recommendation.`;

  try {
    const response = await generateCompletion(prompt, systemPrompt);
    
    // Extract JSON from response
    let jsonStr = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }
    
    const parsed = JSON.parse(jsonStr);
    
    return parsed;
  } catch (error) {
    console.error('Error comparing proposals:', error.message);
    throw new Error('Failed to compare proposals');
  }
}

/**
 * Check if Ollama is running and model is available
 */
async function checkOllamaStatus() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
    const models = response.data.models || [];
    const modelExists = models.some(m => m.name.includes(OLLAMA_MODEL.split(':')[0]));
    
    return {
      running: true,
      model_available: modelExists,
      models: models.map(m => m.name)
    };
  } catch (error) {
    return {
      running: false,
      model_available: false,
      error: error.message
    };
  }
}

module.exports = {
  generateCompletion,
  parseRFPFromDescription,
  parseVendorResponse,
  compareProposals,
  checkOllamaStatus
};
