import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
}

interface Props {
  websiteContent: string;
  onClose: () => void;
}

export default function Chatbot({ websiteContent, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, websiteContent }),
      });
      if (!response.ok) throw new Error('Failed to get response');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      let fullMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        fullMessage += text;
        setStreamingMessage(fullMessage);
      }
      setMessages(prev => [...prev, { text: fullMessage, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, an error occurred. Please try again.', isUser: false }]);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-[#F0F4F8] rounded-lg shadow-lg flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center p-4 bg-[#B5A5D1] text-white rounded-t-lg"
      >
        <h2 className="text-xl font-bold">Chatbot</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-2xl"
        >
          &times;
        </motion.button>
      </motion.div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`${
                message.isUser ? 'ml-auto bg-[#3F4E82] text-white' : 'mr-auto bg-white text-black'
              } rounded-lg p-3 max-w-[80%] shadow-md`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </motion.div>
          ))}
          {streamingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto bg-white text-black rounded-lg p-3 max-w-[80%] shadow-md"
            >
              <ReactMarkdown>{streamingMessage}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-[#B5A5D1]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full p-2 border rounded resize-none text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3F4E82]"
          rows={1}
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full px-4 py-2 bg-[#3F4E82] text-white rounded hover:bg-[#2A3C6C] disabled:bg-gray-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </motion.button>
      </form>
    </motion.div>
  );
}