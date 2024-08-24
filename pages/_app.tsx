// File: /pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AnalysisProvider } from '../contexts/AnalysisContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AnalysisProvider>
      <Component {...pageProps} />
    </AnalysisProvider>
  );
}

export default MyApp;