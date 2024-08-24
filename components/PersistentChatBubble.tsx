// File: /components/PersistentChatBubble.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

interface Props {
  websiteContent: string;
}

const PersistentChatBubble: React.FC<Props> = ({ websiteContent }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-coral text-slate w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-umber transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 z-40"
          >
            <Chatbot websiteContent={websiteContent} onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PersistentChatBubble;