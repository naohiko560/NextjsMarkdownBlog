import Layout from '@/components/Layout';
import '@/styles/globals.css';
import SEO from '../next-seo.config';
import { DefaultSeo } from 'next-seo';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </Layout>
  );
}
