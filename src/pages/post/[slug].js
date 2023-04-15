import fs from 'fs';
import matter from 'gray-matter';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function getStaticProps({ params }) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);

  return { props: { frontMatter: data, content, slug: params.slug } };
}

export async function getStaticPaths() {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));

  console.log('paths:', paths);
  return {
    paths,
    fallback: false,
  };
}

const Post = ({ frontMatter, content, slug }) => {
  return (
    <div>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: 'website',
          url: `http:localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `http:localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            },
          ],
        }}
      />

      <div className="prose prose-lg max-w-none">
        <div>
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
          />
        </div>
        <h1 className="mt-12">{frontMatter.title}</h1>
        <ReactMarkdown allowedElements={['h2', 'h3']}>{content}</ReactMarkdown>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ h2: H2, h3: H3 }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Post;
