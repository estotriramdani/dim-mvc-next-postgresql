import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MVC Next.js PostgreSQL</title>
      </Head>
      <div className="fixed bottom-5 right-4">
        <a
          href="https://www.linkedin.com/in/estotriramdani"
          target="_blank"
          rel="noreferrer"
          className="link-hover"
        >
          🧑‍💻 TK3
        </a>
      </div>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
