import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isAnalyzing: boolean;
  domain: string;
}

const AnalysisAnimation: React.FC<Props> = ({ isAnalyzing, domain }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = [
    'Starting analysis...',
    `Analyzing URL: ${domain}`,
    'Processing start',
    'Fetching page content...',
    'Analyzing with AI...',
  ];

  const advanceStep = useCallback(() => {
    setCurrentStepIndex((prevIndex) => 
      prevIndex < steps.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [steps.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isAnalyzing) {
      setCurrentStepIndex(0);
      intervalId = setInterval(advanceStep, 2000);
    } else {
      setCurrentStepIndex(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnalyzing, advanceStep]);

  if (!isAnalyzing) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-primary bg-opacity-90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-card text-2xl font-bold max-w-md w-full px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-4 h-16 flex items-center justify-center"
          >
            {steps[currentStepIndex]}
          </motion.p>
        </AnimatePresence>
        <motion.div 
          className="bg-card h-2 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        />
        <p className="text-sm mt-2">This may take a few moments...</p>
      </div>
    </motion.div>
  );
};

export default AnalysisAnimation;