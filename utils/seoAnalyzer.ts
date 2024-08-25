// File: utils/seoAnalyzer.ts

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
        "keywordOptimization": {
          "aspectsCovered": [
            "Keyword research and selection",
            "Keyword density",
            "LSI (Latent Semantic Indexing) keywords"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "contentStructure": {
          "aspectsCovered": [
            "Heading tags (H1, H2, etc.)",
            "Content organization",
            "Featured snippet optimization"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "metaInformation": {
          "aspectsCovered": [
            "Title tag optimization",
            "Meta descriptions",
            "Social media meta tags"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "urlAndInternalLinking": {
          "aspectsCovered": [
            "URL structure",
            "Internal linking strategy",
            "Anchor text optimization"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "visualElementOptimization": {
          "aspectsCovered": [
            "Image optimization",
            "Alt text for images",
            "Multimedia integration"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "schemaAndStructuredData": {
          "aspectsCovered": [
            "Schema markup implementation",
            "Structured data for rich snippets",
            "Microdata usage"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        }
      },
      "technicalAspects": {
        "sitePerformance": {
          "aspectsCovered": [
            "Site speed optimization",
            "Page load time",
            "Core Web Vitals"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "mobileOptimization": {
          "aspectsCovered": [
            "Mobile responsiveness",
            "Mobile-first indexing considerations"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "indexingAndCrawlability": {
          "aspectsCovered": [
            "XML sitemap",
            "Robots.txt configuration",
            "Crawl budget optimization"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "securityAndErrorHandling": {
          "aspectsCovered": [
            "SSL certificate implementation",
            "Error page handling (404, 500, etc.)",
            "Security protocols"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "internationalSEO": {
          "aspectsCovered": [
            "Hreflang tags",
            "Canonical tags",
            "Geotargeting considerations"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "technicalInfrastructure": {
          "aspectsCovered": [
            "Site architecture",
            "Pagination handling",
            "Gzip compression"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        }
      },
      "contentQuality": {
        "contentRelevanceAndDepth": {
          "aspectsCovered": [
            "Relevance to target audience",
            "Comprehensiveness of coverage",
            "Content length and depth"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "contentFreshnessAndOriginality": {
          "aspectsCovered": [
            "Content update frequency",
            "Originality of content",
            "Unique value proposition"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "accuracyAndExpertise": {
          "aspectsCovered": [
            "Factual accuracy",
            "Demonstration of expertise",
            "Authority and trustworthiness"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "readabilityAndEngagement": {
          "aspectsCovered": [
            "Readability score",
            "User engagement metrics",
            "Call-to-action effectiveness"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "multimediaAndFormatting": {
          "aspectsCovered": [
            "Use of images, videos, infographics",
            "Content formatting and structure",
            "Visual appeal"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        },
        "userExperienceAndSharing": {
          "aspectsCovered": [
            "Overall user experience",
            "Social sharing potential",
            "Semantic relevance and context"
          ],
          "analysis": string,
          "strengths": [string],
          "weaknesses": [string],
          "recommendations": [string]
        }
      },
      "overallAnalysis": string,
      "overallRecommendations": [string]
    }

    For each subcategory:
    1. Provide a thorough analysis based on SEO best practices, considering the aspects covered.
    2. Identify clear strengths in the current implementation.
    3. Highlight specific weaknesses or areas for improvement.
    4. Offer specific, actionable recommendations for improvement.
    5. Be critical and honest in identifying issues and areas for improvement.
    6. Provide detailed explanations in the 'analysis' fields, including specific examples from the content.

    In the overall analysis and recommendations:
    1. Summarize the key findings across all categories.
    2. Prioritize the most important recommendations that will have the biggest impact on SEO.

    Ensure your response is thorough, critical, and in valid JSON format. Your goal is to provide a comprehensive assessment that will genuinely help improve the website's SEO across all aspects analyzed.
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