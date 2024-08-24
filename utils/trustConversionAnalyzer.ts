import { TrustConversionData } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTrustConversion(pageContent: string): Promise<TrustConversionData> {
  const prompt = `
  Critically analyze the following webpage HTML content for trust and conversion factors:
  ${pageContent}

  Provide a detailed, unbiased analysis in JSON format with the following structure:
  {
    "documentStructure": {
      "semanticHTML": boolean,
      "headingStructure": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "contentElements": {
      "valueProposition": boolean,
      "structuredData": boolean,
      "trustElements": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "navigation": {
      "clearStructure": boolean,
      "searchFunctionality": boolean,
      "footerLinks": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "forms": {
      "count": number,
      "validationAttributes": boolean,
      "clearLabels": boolean,
      "securityIndicators": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "ctaElements": {
      "count": number,
      "actionOrientedText": boolean,
      "strategicPlacement": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "socialProof": {
      "testimonials": boolean,
      "socialMediaIntegration": boolean,
      "customerReferences": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "trustSignals": {
      "securityBadges": boolean,
      "certifications": boolean,
      "affiliations": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "credibilityIndicators": {
      "aboutSection": boolean,
      "companyHistory": boolean,
      "professionalAccreditations": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "accessibilityUsability": {
      "ariaAttributes": boolean,
      "imageAltText": boolean,
      "colorContrast": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "mobileOptimization": {
      "responsiveDesign": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "legalCompliance": {
      "privacyPolicy": {
        "present": boolean,
        "easilyAccessible": boolean
      },
      "termsOfService": {
        "present": boolean,
        "easilyAccessible": boolean
      },
      "cookieConsent": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "valueProposition": {
      "clearBenefits": boolean,
      "uniqueSellingPoints": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "riskReduction": {
      "guarantees": boolean,
      "clearPricing": boolean,
      "shippingInfo": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "contactInformation": {
      "physicalAddress": boolean,
      "phoneNumber": boolean,
      "emailAddress": boolean,
      "contactForm": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "customerSupport": {
      "liveChatAvailable": boolean,
      "chatbotAvailable": boolean,
      "supportHoursListed": boolean,
      "faqSection": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "checkoutProcess": {
      "steps": number,
      "guestCheckout": boolean,
      "securePayment": boolean,
      "analysis": string,
      "recommendations": [string]
    },
    "overallAnalysis": string,
    "overallRecommendations": [string]
  }

  For each section:
  1. Be brutally honest in identifying issues and areas for improvement.
  2. Don't assume quality without clear evidence in the HTML.
  3. Provide specific, actionable recommendations for improvement in the 'recommendations' array.
  4. If a particular aspect is poorly implemented or missing, state it clearly.
  5. Consider industry standards and best practices in your analysis.
  6. Don't hesitate to point out if the website fails to meet basic professional standards for trust and conversion.
  7. If claims made in the content are contradicted by the implementation, highlight this discrepancy.
  8. For boolean fields, only mark as true if the feature is properly implemented and effective.
  9. In the 'analysis' fields, provide detailed explanations, including specific examples from the HTML content.
  10. Highlight both positive and negative aspects, but lean towards critical analysis to drive improvement.
  11. Ensure that each 'recommendations' array contains at least 2-3 specific, actionable suggestions.

  Pay special attention to:
  - The presence and accessibility of Privacy Policy and Terms of Service pages.
  - The availability and prominence of contact information.
  - The presence of customer support features like live chat or chatbots.
  - The overall transparency and professionalism conveyed through these trust elements.

  Ensure your response is thorough, critical, and in valid JSON format. Your goal is to provide a realistic assessment that will genuinely help improve the website's trust factors and conversion potential.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a CRO expert analyzing websites for trust and conversion factors. Your analysis should be detailed, critical, and actionable." },
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
      const analysisResult: TrustConversionData = JSON.parse(jsonString);
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