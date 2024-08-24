import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import AnalysisForm from '../components/AnalysisForm';
import AnalysisAnimation from '../components/AnalysisAnimation';
import { useAnalysis } from '../contexts/AnalysisContext';
import { motion } from 'framer-motion';
import { AnalysisData, TrustConversionData, CopyAnalysisData, SEOAnalysisData } from '../types';

export default function Home() {
  const { 
    analysisData, 
    setAnalysisData, 
    setTrustConversionData, 
    setCopyAnalysisData,
    setSEOAnalysisData 
  } = useAnalysis();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [websiteContent, setWebsiteContent] = useState('');

  const handleAnalysis = async (inputDomain: string) => {
    setIsLoading(true);
    setError(null);
    setDomain(inputDomain);
    setAnalysisData(null);
    setTrustConversionData(null);
    setCopyAnalysisData(null);
    setSEOAnalysisData(null);
    setWebsiteContent('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: inputDomain }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Received analysis data:', data);
        setAnalysisData(data.analysis);
        setTrustConversionData(data.trustConversionData);
        setCopyAnalysisData(data.copyAnalysisData);
        setSEOAnalysisData(data.seoAnalysisData);
        setWebsiteContent(data.websiteContent || '');
      } else {
        setError(data.error || 'An error occurred during analysis');
      }
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout websiteContent={websiteContent}>
      <Head>
        <title>CRO App Dashboard</title>
        <meta name="description" content="CRO analysis tool for Micro SaaS websites" />
      </Head>
      <div className="space-y-8 p-6">
        <motion.section 
          className="bg-card p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
          <div className="max-w-2xl">
            <AnalysisForm onSubmit={handleAnalysis} isLoading={isLoading} />
          </div>
        </motion.section>

        {error && (
          <motion.section 
            className="bg-accent text-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg">{error}</p>
          </motion.section>
        )}

        <AnalysisAnimation isAnalyzing={isLoading} domain={domain} />

        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(analysisData).map(([key, value], index) => (
              <AnalysisCard key={key} title={formatTitle(key)} data={value} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const AnalysisCard: React.FC<{ title: string; data: any }> = ({ title, data }) => {
  return (
    <motion.div 
      className="bg-card p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
            {['strengths', 'weaknesses', 'recommendations'].map((subKey) => (
              <div key={subKey} className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-accent uppercase">{subKey}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {data[subKey].map((item, i) => (
                    <li key={i} className="text-text">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        );
      }

      function formatTitle(key: string): string {
        return key.split(/(?=[A-Z])/).join(' ');
      }