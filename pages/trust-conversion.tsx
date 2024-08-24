import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import TrustConversionAnalysis from '../components/TrustConversionAnalysis';
import { useAnalysis } from '../contexts/AnalysisContext';
import { motion } from 'framer-motion';

export default function TrustConversionPage() {
  const { trustConversionData } = useAnalysis();
  return (
    <Layout>
      <Head>
        <title>Trust & Conversion Analysis - CRO App</title>
        <meta name="description" content="Detailed Trust & Conversion analysis for your website" />
      </Head>
      {trustConversionData ? (
        <TrustConversionAnalysis data={trustConversionData} />
      ) : (
        <div className="flex justify-center pt-16 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4 text-[#3F4E82]">Trust & Conversion Analysis</h1>
            <p className="mb-6 text-gray-700">No trust and conversion data available. Please run an analysis first.</p>
            <Link href="/">
              <motion.span 
                className="inline-block bg-[#3F4E82] text-white px-6 py-3 rounded cursor-pointer text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard
              </motion.span>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}