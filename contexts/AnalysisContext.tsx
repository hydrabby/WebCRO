import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AnalysisData, TrustConversionData, CopyAnalysisData, SEOAnalysisData } from '../types';

interface AnalysisContextType {
  analysisData: AnalysisData | null;
  trustConversionData: TrustConversionData | null;
  copyAnalysisData: CopyAnalysisData | null;
  seoAnalysisData: SEOAnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
  setTrustConversionData: (data: TrustConversionData | null) => void;
  setCopyAnalysisData: (data: CopyAnalysisData | null) => void;
  setSEOAnalysisData: (data: SEOAnalysisData | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [trustConversionData, setTrustConversionData] = useState<TrustConversionData | null>(null);
  const [copyAnalysisData, setCopyAnalysisData] = useState<CopyAnalysisData | null>(null);
  const [seoAnalysisData, setSEOAnalysisData] = useState<SEOAnalysisData | null>(null);

  return (
    <AnalysisContext.Provider value={{ 
      analysisData, 
      trustConversionData, 
      copyAnalysisData,
      seoAnalysisData,
      setAnalysisData, 
      setTrustConversionData,
      setCopyAnalysisData,
      setSEOAnalysisData
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};