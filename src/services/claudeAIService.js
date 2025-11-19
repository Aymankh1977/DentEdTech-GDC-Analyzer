import { ApiKeyManager } from './apiKeyManager.js';

// Use the local proxy server with CORRECT endpoint
const API_BASE_URL = 'http://localhost:3001';
const AI_ENDPOINT = '/api/claude'; // CORRECTED ENDPOINT

// Use YOUR exact model - claude-3-haiku-20240307
const WORKING_MODEL = 'claude-3-haiku-20240307';

export class ClaudeAIService {
  static async analyzeDocumentWithClaude(fileContent, fileName, requirements) {
    console.log('🧠 CLAUDE AI: Starting REAL AI document analysis');
    
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('🚫 REAL AI REQUIRED: No API key available. Please add your Anthropic API key to enable AI analysis.');
    }

    const prompt = this.createComprehensiveAnalysisPrompt(fileContent, fileName, requirements);
    
    console.log('🚀 Sending to REAL Claude API with YOUR model:', WORKING_MODEL);
    const response = await this.callClaudeAPI(apiKey, prompt);
    return this.parseClaudeResponse(response);
  }

  static async generateQuestionnaireWithClaude(requirements, documentContext) {
    console.log('📝 CLAUDE AI: Generating REAL AI questionnaire');
    
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('🚫 REAL AI REQUIRED: No API key available for questionnaire generation.');
    }

    const prompt = this.createQuestionnairePrompt(requirements, documentContext);
    const response = await this.callClaudeAPI(apiKey, prompt);
    return this.parseQuestionnaireResponse(response);
  }

  static async generateGoldStandardWithClaude(requirements, analysisResults) {
    console.log('🏆 CLAUDE AI: Generating REAL AI gold standard');
    
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('🚫 REAL AI REQUIRED: No API key available for gold standard generation.');
    }

    const prompt = this.createGoldStandardPrompt(requirements, analysisResults);
    const response = await this.callClaudeAPI(apiKey, prompt);
    return this.parseGoldStandardResponse(response);
  }

  static createComprehensiveAnalysisPrompt(fileContent, fileName, requirements) {
    const requirementsText = requirements.map(req => 
      `REQUIREMENT ${req.code}: ${req.title}
Domain: ${req.domain} | Category: ${req.category} | Weight: ${req.weight}
Description: ${req.description}
Criteria: ${req.criteria.join(', ')}`
    ).join('\n\n');

    return `As a GDC (General Dental Council) standards expert, analyze this dental education document against the requirements.

DOCUMENT: ${fileName}
CONTENT: ${fileContent.substring(0, 8000)}...

REQUIREMENTS (${requirements.length}):
${requirementsText}

For EACH requirement, provide analysis in this EXACT JSON format:

[
  {
    "requirement": {original requirement object},
    "analysis": {
      "status": "met|partially-met|not-met",
      "confidence": number,
      "evidence": ["evidence1", "evidence2"],
      "missingElements": ["missing1", "missing2"],
      "recommendations": ["recommendation1", "recommendation2"],
      "relevantContent": ["content1", "content2"]
    },
    "score": number
  }
]

Be specific, evidence-based, and actionable. Return ONLY the JSON array.`;
  }

  static createQuestionnairePrompt(requirements, documentContext) {
    return `Generate a GDC pre-inspection questionnaire based on this analysis:

REQUIREMENTS: ${JSON.stringify(requirements.slice(0, 5), null, 2)}
CONTEXT: ${documentContext}

Create a questionnaire with this EXACT JSON structure:

{
  "id": "gdc-questionnaire-${Date.now()}",
  "programName": "Extracted from document",
  "institution": "University Dental School",
  "questionnaireType": "pre-inspection",
  "filledDate": "${new Date().toISOString().split('T')[0]}",
  "answers": [
    {
      "question": "Question text",
      "answer": "Evidence-based answer",
      "evidence": ["evidence1"],
      "complianceLevel": "fully-compliant|partially-compliant|non-compliant",
      "recommendations": ["recommendation1"],
      "references": ["GDC Standard"]
    }
  ],
  "overallCompliance": number,
  "summary": "Executive summary",
  "generatedFromAnalysis": true,
  "inspectionReady": boolean
}

Return ONLY the JSON.`;
  }

  static createGoldStandardPrompt(requirements, analysisResults) {
    const overallScore = Math.round(analysisResults.reduce((sum, req) => sum + req.score, 0) / analysisResults.length);
    
    return `Create a Gold Standard Improvement Framework based on this GDC analysis:

OVERALL SCORE: ${overallScore}%
REQUIREMENTS ANALYZED: ${analysisResults.length}

Provide a comprehensive gold standard framework with specific implementation steps, timelines, and success metrics. Focus on patient safety, assessment excellence, and quality enhancement.

Return as a detailed text report.`;
  }

  static async callClaudeAPI(apiKey, prompt) {
    console.log('🚀 CLAUDE API: Calling REAL AI endpoint:', API_BASE_URL + AI_ENDPOINT);
    console.log('🔑 API key detected:', !!apiKey);
    console.log('🤖 Using model:', WORKING_MODEL);
    console.log('📝 Prompt length:', prompt.length);
    
    try {
      const response = await fetch(API_BASE_URL + AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: WORKING_MODEL,
          max_tokens: 4000
        })
      });

      console.log('📡 API Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        if (response.status === 404) {
          throw new Error(`AI endpoint not found: ${API_BASE_URL}${AI_ENDPOINT}. Check proxy server.`);
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Check your Anthropic API key.');
        }
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ REAL AI: Successfully received response from', WORKING_MODEL);
      return data;
      
    } catch (error) {
      console.error('❌ REAL AI API Request failed:', error.message);
      throw new Error(`AI service unavailable: ${error.message}. Make sure proxy server is running.`);
    }
  }

  static parseClaudeResponse(response) {
    try {
      if (response.error) {
        throw new Error(`Claude API error: ${response.error.message}`);
      }

      const content = response.content?.[0]?.text || '';
      console.log('📄 AI Response length:', content.length);
      
      if (!content) {
        throw new Error('Empty response from AI');
      }

      // Clean and parse JSON
      const cleanContent = content.trim();
      const jsonMatch = cleanContent.match(/\[\s*{[\s\S]*?}\s*\]/) || cleanContent.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON Parsed successfully:', Array.isArray(parsed) ? `${parsed.length} items` : 'object');
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          console.error('❌ JSON parse error:', e.message);
        }
      }

      // Try direct parse as last resort
      try {
        const parsed = JSON.parse(cleanContent);
        console.log('✅ Direct JSON parse successful');
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        throw new Error('AI returned non-JSON response: ' + cleanContent.substring(0, 200));
      }
      
    } catch (error) {
      console.error('❌ AI Response parsing failed:', error.message);
      throw new Error(`AI response parsing failed: ${error.message}`);
    }
  }

  static parseQuestionnaireResponse(response) {
    try {
      const content = response.content?.[0]?.text || '';
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Questionnaire parsing failed: ${error.message}`);
    }
  }

  static parseGoldStandardResponse(response) {
    return response.content?.[0]?.text || 'Gold standard framework generated by AI';
  }
}

export default ClaudeAIService;
