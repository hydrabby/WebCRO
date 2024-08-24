export interface TrustConversionData {
  documentStructure: {
    semanticHTML: boolean;
    headingStructure: boolean;
    analysis: string;
  };
  contentElements: {
    valueProposition: boolean;
    structuredData: boolean;
    trustElements: boolean;
    analysis: string;
  };
  navigation: {
    clearStructure: boolean;
    searchFunctionality: boolean;
    footerLinks: boolean;
    analysis: string;
  };
  forms: {
    count: number;
    validationAttributes: boolean;
    clearLabels: boolean;
    securityIndicators: boolean;
    analysis: string;
  };
  ctaElements: {
    count: number;
    actionOrientedText: boolean;
    strategicPlacement: boolean;
    analysis: string;
  };
  socialProof: {
    testimonials: boolean;
    socialMediaIntegration: boolean;
    customerReferences: boolean;
    analysis: string;
  };
  trustSignals: {
    securityBadges: boolean;
    certifications: boolean;
    affiliations: boolean;
    analysis: string;
  };
  credibilityIndicators: {
    aboutSection: boolean;
    companyHistory: boolean;
    professionalAccreditations: boolean;
    analysis: string;
  };
  accessibilityUsability: {
    ariaAttributes: boolean;
    imageAltText: boolean;
    formLabeling: boolean;
    analysis: string;
  };
  mobileOptimization: {
    responsiveDesign: boolean;
    analysis: string;
  };
  externalTrustResources: {
    reviewPlatforms: boolean;
    externalValidation: boolean;
    analysis: string;
  };
  legalCompliance: {
    cookieConsent: boolean;
    privacyPolicy: boolean;
    termsOfService: boolean;
    analysis: string;
  };
  contactSupport: {
    contactDetails: boolean;
    liveChat: boolean;
    faqSection: boolean;
    analysis: string;
  };
  valueProposition: {
    clearBenefits: boolean;
    uniqueSellingPoints: boolean;
    analysis: string;
  };
  riskReduction: {
    guarantees: boolean;
    clearPricing: boolean;
    shippingInfo: boolean;
    analysis: string;
  };
  overallAnalysis: string;
}

export interface CopyAnalysisData {
  keywordsUsage: {
    primaryKeywordUsage: boolean;
    secondaryKeywordUsage: boolean;
    keywordDensity: string;
    analysis: string;
    recommendations: string[];
  };
  contentStructure: {
    properHeadingHierarchy: boolean;
    paragraphLength: string;
    useOfLists: boolean;
    analysis: string;
    recommendations: string[];
  };
  contentQuality: {
    depth: string;
    originality: string;
    analysis: string;
    recommendations: string[];
  };
  userIntent: {
    alignmentWithIntent: boolean;
    addressingUserNeeds: boolean;
    analysis: string;
    recommendations: string[];
  };
  callToAction: {
    presence: boolean;
    clarity: boolean;
    effectiveness: string;
    analysis: string;
    recommendations: string[];
  };
  copywritingFramework: {
    identifiedFramework: string;
    effectiveImplementation: boolean;
    analysis: string;
    recommendations: string[];
  };
  clearCompellingMessage: {
    coreIdeaCommunicated: boolean;
    valuePropositionPresent: boolean;
    analysis: string;
    recommendations: string[];
  };
  strongHeadline: {
    attentionGrabbing: boolean;
    keywordInclusion: boolean;
    analysis: string;
    recommendations: string[];
  };
  audienceUnderstanding: {
    targetAudienceClarity: boolean;
    contentRelevance: string;
    analysis: string;
    recommendations: string[];
  };
  benefitsFocusedCopy: {
    benefitsHighlighted: boolean;
    featureToBenefitRatio: string;
    analysis: string;
    recommendations: string[];
  };
  readabilityAndScannability: {
    readabilityScore: string;
    useOfSubheadings: boolean;
    bulletPoints: boolean;
    analysis: string;
    recommendations: string[];
  };
  emotionalAppeal: {
    useOfEmotionalTriggers: boolean;
    storytellingElements: boolean;
    analysis: string;
    recommendations: string[];
  };
  uniqueSellingProposition: {
    clearUSP: boolean;
    uspProminent: boolean;
    analysis: string;
    recommendations: string[];
  };
  grammarAndSpelling: {
    errorFree: boolean;
    consistentStyle: boolean;
    analysis: string;
    recommendations: string[];
  };
  storytellingElements: {
    presenceOfNarrative: boolean;
    effectiveUseOfStories: boolean;
    analysis: string;
    recommendations: string[];
  };
  toneAndVoice: {
    consistentTone: boolean;
    brandAlignment: boolean;
    analysis: string;
    recommendations: string[];
  };
  overallAnalysis: string;
}

export interface AnalysisData {
  Design: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  Copy: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "User Experience (UX)": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "Call to Action (CTA)": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "SEO - On-page optimization": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "SEO - Technical aspects": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "SEO - Content quality": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "Mobile responsiveness": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  Performance: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  "Trust and Credibility": {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface PageAnalysisData {
  url: string;
  title: string;
  seoScore: number;
  titleTag: string;
  metaDescription: string;
  h1: string;
  keywordUsage: string;
  wordCount: number;
  readabilityScore: string;
  contentQuality: string;
  loadTime: string;
  mobileFriendly: boolean;
  https: boolean;
  recommendations: string[];
}

export interface SEOAnalysisData {
  onPageOptimization: CategoryData;
  userExperienceAndEngagement: CategoryData;
  contentQuality: CategoryData;
  linkOptimization: CategoryData;
  technicalSEO: CategoryData;
  advancedOnPageTechniques: CategoryData;
  technicalPerformanceAndArchitecture: CategoryData;
  overallAnalysis: string;
  overallRecommendations: Recommendation[];
  error?: string;
}

interface CategoryData {
  [key: string]: FactorData;
}

interface FactorData {
  score: number;
  analysis: string;
  recommendations: string[];
  currentImplementation: string;
  specificExamples: string[];
  industryComparison: string;
  impactAssessment: string;
  implementationPriority: string;
  potentialChallenges: string;
}

interface Recommendation {
  recommendation: string;
  priority: string;
  impact: string;
  effort: string;
}