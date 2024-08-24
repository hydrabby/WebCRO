import { CopyAnalysisData } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCopy(pageContent: string): Promise<CopyAnalysisData> {
  console.log('Starting copy analysis...');
  const prompt = `
    Critically analyze the following webpage content for copy and content factors:
    ${pageContent}

    Provide a detailed, unbiased analysis in JSON format with the following structure:

    {
      "headingAnalysis": {
        "text": string,
        "analysis": string,
        "isClever": boolean,
        "addressesPainPoint": boolean,
        "offersSolution": boolean,
        "copywritingFramework": string | null,
        "isBenefitOriented": boolean,
        "effectiveness": number
      },
      "subheadingAnalysis": {
        "text": string,
        "analysis": string,
        "supportsHeading": boolean,
        "clarifiesValue": boolean,
        "effectiveness": number
      },
      "keywordsUsage": {
        "primaryKeyword": string,
        "primaryKeywordUsage": boolean,
        "primaryKeywordFrequency": number,
        "secondaryKeywords": [string],
        "secondaryKeywordUsage": boolean,
        "keywordDensity": string,
        "analysis": string,
        "recommendations": [string]
      },
      "contentStructure": {
        "properHeadingHierarchy": boolean,
        "headingStructure": [string],
        "paragraphLength": {
          "average": number,
          "longest": number,
          "shortest": number
        },
        "useOfLists": boolean,
        "numberOfLists": number,
        "analysis": string,
        "recommendations": [string]
      },
      "contentQuality": {
        "depth": string,
        "originality": string,
        "relevance": string,
        "accuracy": string,
        "analysis": string,
        "recommendations": [string]
      },
      "userIntent": {
        "alignmentWithIntent": boolean,
        "identifiedUserIntents": [string],
        "addressingUserNeeds": boolean,
        "analysis": string,
        "recommendations": [string]
      },
      "callToAction": {
        "numberOfCTAs": number,
        "ctaLocations": [string],
        "ctaTexts": [string],
        "ctaColors": {
          "buttonColor": string,
          "textColor": string,
          "backgroundColor": string
        },
        "presence": boolean,
        "clarity": boolean,
        "effectiveness": string,
        "useOfAnimation": boolean,
        "analysis": string,
        "recommendations": [string]
      },
      "copywritingFramework": {
        "identifiedFramework": string,
        "effectiveImplementation": boolean,
        "frameworkBreakdown": {
          "attention": string,
          "interest": string,
          "desire": string,
          "action": string
        },
        "analysis": string,
        "recommendations": [string]
      },
      "clearCompellingMessage": {
        "coreIdeaCommunicated": boolean,
        "valuePropositionPresent": boolean,
        "uniqueSellingPoints": [string],
        "analysis": string,
        "recommendations": [string]
      },
      "strongHeadline": {
        "mainHeadline": string,
        "subheadlines": [string],
        "attentionGrabbing": boolean,
        "keywordInclusion": boolean,
        "headlineFormula": string,
        "analysis": string,
        "recommendations": [string]
      },
      "audienceUnderstanding": {
        "targetAudienceClarity": boolean,
        "identifiedAudiences": [string],
        "contentRelevance": string,
        "personalization": string,
        "analysis": string,
        "recommendations": [string]
      },
      "benefitsFocusedCopy": {
        "benefitsHighlighted": boolean,
        "listOfBenefits": [string],
        "featureToBenefitRatio": string,
        "analysis": string,
        "recommendations": [string]
      },
      "readabilityAndScannability": {
        "readabilityScore": string,
        "averageSentenceLength": number,
        "useOfSubheadings": boolean,
        "bulletPoints": boolean,
        "useOfWhitespace": string,
        "fontChoices": {
          "headings": string,
          "bodyText": string
        },
        "analysis": string,
        "recommendations": [string]
      },
      "emotionalAppeal": {
        "useOfEmotionalTriggers": boolean,
        "identifiedEmotions": [string],
        "storytellingElements": boolean,
        "analysis": string,
        "recommendations": [string]
      },
      "uniqueSellingProposition": {
        "clearUSP": boolean,
        "uspStatement": string,
        "uspProminent": boolean,
        "competitiveAdvantage": string,
        "analysis": string,
        "recommendations": [string]
      },
      "grammarAndSpelling": {
        "errorFree": boolean,
        "identifiedErrors": [string],
        "consistentStyle": boolean,
        "toneOfVoice": string,
        "analysis": string,
        "recommendations": [string]
      },
      "storytellingElements": {
        "presenceOfNarrative": boolean,
        "storyStructure": string,
        "charactersDeveloped": boolean,
        "conflictResolution": boolean,
        "effectiveUseOfStories": boolean,
        "analysis": string,
        "recommendations": [string]
      },
      "toneAndVoice": {
        "consistentTone": boolean,
        "identifiedTone": string,
        "brandAlignment": boolean,
        "formalityLevel": string,
        "analysis": string,
        "recommendations": [string]
      },
      "overallAnalysis": string,
      "overallRecommendations": [string]
    }

    For each section:
    1. Be thorough and specific in your analysis. Use concrete examples from the content.
    2. Provide detailed, actionable recommendations that go beyond generic advice.
    3. Consider industry best practices and current trends in your analysis.
    4. Be critical where necessary, pointing out areas that need significant improvement.
    5. Highlight both strengths and weaknesses, but focus on actionable insights.

    Specific instructions for key sections:

    Heading and Subheading Analysis:
    - Analyze the main heading and subheading separately.
    - For the heading, assess its clarity, cleverness, whether it addresses a pain point or offers a solution, and its overall effectiveness.
    - For the subheading, evaluate how well it supports the main heading, clarifies value, and its effectiveness.
    - Identify any copywriting frameworks used in the heading/subheading.

    Call To Action (CTA):
    - Identify and analyze each CTA separately.
    - Comment on the wording, placement, and design of each CTA.
    - Discuss the visual aspects including color contrast, size, and any animations.
    - Suggest specific improvements for each CTA, including alternative wording if necessary.

    Content Structure:
    - Analyze the hierarchy and effectiveness of headings.
    - Comment on paragraph length and its impact on readability.
    - Discuss the use of lists, tables, or other structural elements.

    Copywriting Framework:
    - Identify the primary framework used (e.g., AIDA, PAS, FAB).
    - Analyze how well each part of the framework is executed.
    - Suggest improvements for each part of the framework.

    Emotional Appeal and Storytelling:
    - Identify specific emotional triggers used in the copy.
    - Analyze any storytelling elements and their effectiveness.
    - Suggest ways to enhance emotional connection with the audience.

    Your goal is to provide a comprehensive, actionable assessment that will genuinely help improve the website's copy and content. Be thorough, critical, and ensure your response is in valid JSON format.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a copy analysis expert analyzing websites for content effectiveness." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("Raw OpenAI response:", content);

    // Remove backticks, "json" tag, and any leading/trailing whitespace
    const cleanedContent = content.replace(/^```json\s?/, '').replace(/\s?```$/, '').trim();

    try {
      const analysisResult: CopyAnalysisData = JSON.parse(cleanedContent);
      console.log("Parsed copy analysis result:", analysisResult);
      return analysisResult;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse OpenAI response");
    }
  } catch (error) {
    console.error("Error in AI analysis:", error);
    throw error;
  }
}