import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onClick?: () => void;
  isSmall?: boolean;
}

const ExpandableCard: React.FC<Props> = ({ title, children, isExpanded = false, onClick, isSmall = false }) => {
  const [isOpen, setIsOpen] = useState(isExpanded);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isSmall ? 'text-sm' : ''}`}>
      <motion.button
        className="w-full text-left p-4 flex justify-between items-center"
        onClick={handleClick}
      >
        <span className={`font-semibold ${isSmall ? 'text-base' : 'text-lg'}`}>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {(isOpen || isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableCard;