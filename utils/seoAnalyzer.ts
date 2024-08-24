import { SEOAnalysisData } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function sanitizeJSONString(jsonString: string): string {
  let cleaned = jsonString.trim();
  cleaned = cleaned.replace(/^```json\s*|```$/g, '');

  if (!cleaned.startsWith('{')) cleaned = '{' + cleaned;
  if (!cleaned.endsWith('}')) cleaned += '}';

  cleaned = cleaned.replace(/,(\s*[\]}])/g, '$1');

  let openBraces = 0;
  let openBrackets = 0;
  let cleanedArray = cleaned.split('');

  for (let i = 0; i < cleanedArray.length; i++) {
    if (cleanedArray[i] === '{') openBraces++;
    if (cleanedArray[i] === '}') openBraces--;
    if (cleanedArray[i] === '[') openBrackets++;
    if (cleanedArray[i] === ']') openBrackets--;

    if (openBraces < 0) {
      cleanedArray.splice(i, 1);
      openBraces = 0;
      i--;
    }
    if (openBrackets < 0) {
      cleanedArray.splice(i, 1);
      openBrackets = 0;
      i--;
    }
  }

  while (openBraces > 0) {
    cleanedArray.push('}');
    openBraces--;
  }
  while (openBrackets > 0) {
    cleanedArray.push(']');
    openBrackets--;
  }

  return cleanedArray.join('');
}

function getCategoryPrompt(category: string, pageContent: string, sitemapContent: string): string {
  return `
    As an expert SEO analyst, provide a comprehensive analysis of the following webpage HTML content and sitemap, focusing on the ${category} category:

    HTML Content:
    ${pageContent}

    Sitemap Content:
    ${sitemapContent}

    Deliver a detailed, unbiased analysis in JSON format with the following structure for each factor in the ${category} category:
    {
      "${category}": {
        ${getCategoryStructure(category)}
      }
    }

    For each factor, provide:
    1. Score: A number from 0 to 100, with a brief explanation of the scoring criteria.
    2. Analysis: A detailed examination of the current state, at least 100 words.
    3. Current Implementation: Specific details about how this factor is currently implemented on the site.
    4. Specific Examples: At least 3 concrete examples from the provided HTML or sitemap.
    5. Industry Comparison: How this implementation compares to industry standards or competitors.
    6. Impact Assessment: A thorough explanation of how this factor affects SEO and user experience.
    7. Recommendations: 3-5 specific, actionable suggestions for improvement, each with a detailed explanation.
    8. Implementation Priority: Rank the importance of addressing this factor (High/Medium/Low) with justification.
    9. Potential Challenges: Identify possible obstacles in implementing the recommendations.

    Ensure each analysis is thorough, critical, and provides substantial value for improving the website's SEO. Use specific examples from the provided HTML and sitemap to support your analysis.

    Your response MUST be in valid JSON format. Do not include any text outside of the JSON structure.
  `;
}

function getCategoryStructure(category: string): string {
  const commonStructure = `
    "score": 0,
    "analysis": "",
    "recommendations": [],
    "currentImplementation": "",
    "specificExamples": [],
    "industryComparison": "",
    "impactAssessment": "",
    "implementationPriority": "",
    "potentialChallenges": ""
  `;

  const categoryFactors = {
    onPageOptimization: ['keywordOptimization', 'titleTagOptimization', 'metaDescription', 'urlStructure', 'headingTags', 'contentStructure'],
    technicalSEO: ['siteSpeed', 'mobileResponsiveness', 'xmlSitemap', 'robotsTxt', 'sslCertificate', 'structuredDataMarkup'],
    contentQuality: ['relevanceAndValue', 'comprehensiveness', 'originality', 'freshness', 'accuracy', 'contentLength'],
    userExperienceAndEngagement: ['readability', 'userEngagement', 'multimediaIntegration', 'pageLoadTime', 'coreWebVitals', 'callToAction'],
    linkOptimization: ['internalLinking', 'anchorTextOptimization', 'canonicalTags', 'pagination', 'hreflangTags', 'featuredSnippetOptimization'],
    advancedOnPageTechniques: ['imageOptimization', 'altText', 'keywordDensity', 'lsiKeywords', 'semanticRelevance', 'schemaMarkup'],
    technicalPerformanceAndArchitecture: ['crawlBudgetOptimization', 'errorHandling', 'siteArchitecture', 'gzipCompression', 'socialMediaMetaTags', 'socialSharingPotential']
  };

  return categoryFactors[category as keyof typeof categoryFactors]
    .map(factor => `"${factor}": {${commonStructure}}`)
    .join(',\n');
}

async function analyzeSEOCategory(category: string, pageContent: string, sitemapContent: string): Promise<any> {
  const prompt = getCategoryPrompt(category, pageContent, sitemapContent);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are an SEO expert analyzing websites for ${category} factors. Provide your analysis in valid JSON format only.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error(`No content received from OpenAI for ${category}`);
    }

    console.log(`Raw OpenAI response for ${category}:`, content);

    const sanitizedJsonString = sanitizeJSONString(content);
    try {
      const parsedJson = JSON.parse(sanitizedJsonString);

      if (!parsedJson[category]) {
        throw new Error(`Missing ${category} key in parsed JSON`);
      }

      return parsedJson;
    } catch (parseError) {
      console.error(`Error parsing JSON for ${category}:`, parseError);
      console.error(`Sanitized JSON string:`, sanitizedJsonString);
      return { [category]: { error: `Failed to parse response for ${category}` } };
    }
  } catch (error) {
    console.error(`Error in AI analysis for ${category}:`, error);
    return { [category]: { error: `Failed to analyze ${category}` } };
  }
}

async function analyzeOverall(categories: any): Promise<any> {
  const prompt = `
    Based on the following SEO analysis results, provide an overall analysis and recommendations:

    ${JSON.stringify(categories)}

    Provide your analysis in valid JSON format with the following structure:
    {
      "overallAnalysis": string,
      "overallRecommendations": [
        {
          "recommendation": string,
          "priority": string,
          "impact": string,
          "effort": string
        }
      ]
    }

    The overall analysis should be at least 300 words, summarizing key findings and providing a holistic view of the site's SEO health.

    Your response MUST be in valid JSON format. Do not include any text outside of the JSON structure.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an SEO expert providing an overall analysis based on detailed category results. Provide your analysis in valid JSON format only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI for overall analysis");
    }

    console.log("Raw OpenAI response for overall analysis:", content);

    const sanitizedJsonString = sanitizeJSONString(content);
    try {
      return JSON.parse(sanitizedJsonString);
    } catch (parseError) {
      console.error("Error parsing JSON for overall analysis:", parseError);
      throw new Error(`Failed to parse OpenAI response for overall analysis: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error in overall AI analysis:", error);
    throw error;
  }
}

export async function analyzeSEO(pageContent: string, sitemapContent: string): Promise<SEOAnalysisData> {
  try {
    const categories = [
      'onPageOptimization',
      'technicalSEO',
      'contentQuality',
      'userExperienceAndEngagement',
      'linkOptimization',
      'advancedOnPageTechniques',
      'technicalPerformanceAndArchitecture'
    ];

    const categoryResults = await Promise.all(
      categories.map(category => analyzeSEOCategory(category, pageContent, sitemapContent))
    );

    const categoriesObject = categories.reduce((acc, category, index) => {
      acc[category] = categoryResults[index][category] || { error: `Failed to analyze ${category}` };
      return acc;
    }, {} as Record<string, any>);

    const overallAnalysis = await analyzeOverall(categoriesObject);

    return {
      ...categoriesObject,
      ...overallAnalysis,
      sitemapContent: sitemapContent || ''
    };
  } catch (error) {
    console.error("Error in SEO analysis:", error);
    return {
      error: "Failed to complete SEO analysis",
      sitemapContent: sitemapContent || ''
    } as SEOAnalysisData;
  }
}

export function ensureString(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

export { sanitizeJSONString };