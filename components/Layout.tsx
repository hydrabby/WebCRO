import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import PersistentChatBubble from './PersistentChatBubble';

interface LayoutProps {
  children: ReactNode;
  websiteContent: string;
}

const Layout: React.FC<LayoutProps> = ({ children, websiteContent }) => {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Trust & Conversion', path: '/trust-conversion' },
    { name: 'Copy Analysis', path: '/copy-analysis' },
    { name: 'SEO Analysis', path: '/seo-analysis' }, // New SEO Analysis page
  ];

  return (
    <div className="flex h-screen bg-background">
      <nav className="w-64 bg-card shadow-md p-6">
        <h1 className="text-2xl font-bold mb-8 text-primary">CRO App</h1>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-4">
              <Link href={item.path}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block p-2 rounded cursor-pointer ${
                    router.pathname === item.path ? 'bg-secondary text-white' : 'hover:bg-background text-text'
                  }`}
                >
                  {item.name}
                </motion.span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
      <PersistentChatBubble websiteContent={websiteContent} />
    </div>
  );
};

export default Layout;