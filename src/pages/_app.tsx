import type { AppProps } from 'next/app';

import '../styles/BrowsableModal-transitions.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
