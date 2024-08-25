import { SEOAnalysisData } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSEO(pageContent: string, sitemapContent: string): Promise<SEOAnalysisData> {
  const prompt = `
    Analyze the following webpage HTML content and sitemap for SEO factors:

    HTML Content:
    ${pageContent}

    Sitemap Content:
    ${sitemapContent}

    Provide a detailed, unbiased analysis in JSON format with the following structure:
    {
      "onPageOptimization": {
        "keywords": {
          "primaryKeyword": string,
          "secondaryKeywords": [string],
          "keywordDensity": string,
          "analysis": string,
          "recommendations": [string]
        },
        "titleTag": {
          "content": string,
          "length": number,
          "includesPrimaryKeyword": boolean,
          "analysis": string,
          "recommendations": [string]
        },
        "metaDescription": {
          "content": string,
          "length": number,
          "includesPrimaryKeyword": boolean,
          "analysis": string,
          "recommendations": [string]
        },
        "headings": {
          "h1": {
            "count": number,
            "content": string,
            "includesPrimaryKeyword": boolean
          },
          "h2": {
            "count": number,
            "content": [string]
          },
          "analysis": string,
          "recommendations": [string]
        },
        "contentStructure": {
          "paragraphCount": number,
          "averageParagraphLength": number,
          "useOfLists": boolean,
          "analysis": string,
          "recommendations": [string]
        },
        "internalLinking": {
          "count": number,
          "analysis": string,
          "recommendations": [string]
        },
        "imageOptimization": {
          "imagesWithAltText": number,
          "totalImages": number,
          "analysis": string,
          "recommendations": [string]
        }
      },
      "technicalAspects": {
        "siteSpeed": {
          "analysis": string,
          "recommendations": [string]
        },
        "mobileResponsiveness": {
          "isResponsive": boolean,
          "analysis": string,
          "recommendations": [string]
        },
        "sitemapQuality": {
          "pageCount": number,
          "lastModified": string,
          "analysis": string,
          "recommendations": [string]
        },
        "sslCertificate": {
          "present": boolean,
          "analysis": string,
          "recommendations": [string]
        },
        "structuredData": {
          "present": boolean,
          "types": [string],
          "analysis": string,
          "recommendations": [string]
        },
        "canonicalTags": {
          "present": boolean,
          "analysis": string,
          "recommendations": [string]
        }
      },
      "contentQuality": {
        "relevance": {
          "score": number,
          "analysis": string,
          "recommendations": [string]
        },
        "comprehensiveness": {
          "wordCount": number,
          "topicCoverage": string,
          "analysis": string,
          "recommendations": [string]
        },
        "readability": {
          "score": number,
          "analysis": string,
          "recommendations": [string]
        },
        "engagement": {
          "analysis": string,
          "recommendations": [string]
        }
      },
      "overallAnalysis": string,
      "overallRecommendations": [string]
    }

    For each section:
    1. Provide a thorough analysis based on SEO best practices.
    2. Offer specific, actionable recommendations for improvement.
    3. Be critical and honest in identifying issues and areas for improvement.
    4. Provide detailed explanations in the 'analysis' fields, including specific examples from the content.

    Ensure your response is thorough, critical, and in valid JSON format. Your goal is to provide a comprehensive assessment that will genuinely help improve the website's SEO.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an SEO expert analyzing websites for search engine optimization factors." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("Raw OpenAI response:", content);

    const jsonString = content.replace(/^```json\s*|```$/g, '').trim();

    try {
      const analysisResult: SEOAnalysisData = JSON.parse(jsonString);
      return analysisResult;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse OpenAI response: " + parseError.message);
    }
  } catch (error) {
    console.error("Error in AI analysis:", error);
    throw error;
  }
}