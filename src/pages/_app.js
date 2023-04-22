import Layout from '@/components/Layout';
import 'https://naohiko560.github.io/NextjsMarkdownBlog/src/styles/globals.css';
import 'prismjs/themes/prism-okaidia.css'
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
