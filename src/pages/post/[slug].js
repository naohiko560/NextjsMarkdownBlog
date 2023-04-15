import fs from 'fs';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import remarkGfm from 'remark-gfm';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { createElement } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import remarkUnwrapImages from 'remark-unwrap-images';

export async function getStaticProps({ params }) {
  const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
  const { data, content } = matter(file);

  const result = await unified()
    .use(remarkParse)
    .use(remarkPrism, {
      plugins: ['line-numbers'],
    })
    .use(remarkToc, { heading: '目次', maxDepth: 3, tight: true })
    .use(remarkGfm)
    .use(remarkUnwrapImages)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    props: { frontMatter: data, content: result.toString(), slug: params.slug },
  };
}

const MyLink = ({ children, href }) => {
  if (href == '') href = '/';
  return href.startsWith('/') || href.startsWith('#') ? (
    <Link href={href}>{children}</Link>
  ) : (
    <Link href={href} target="_black" rel="noopener noreferrer">
      {children}
    </Link>
  );
};

const MyImage = ({ src, alt, width, height }) => {
  return <Image src={src} alt={alt} width={width} height={height} />;
};

// ※下記コードと同じ意味
// const toReactNode = (content) => {
//   return unified()
//     .use(rehypeParse, {
//       fragment: true,
//     })
//     .use(rehypeReact, {
//       createElement,
//       Fragment,
//       components: {
//         a: MyLink,
//       },
//     })
//     .processSync(content).result;
// };

// ※上記コードと同じ意味
function toReactNode(content) {
  const [Content, setContent] = useState(Fragment);

  useEffect(() => {
    const processor = unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
          a: MyLink,
          img: MyImage,
        },
      })
      .processSync(content);

    setContent(processor.result);
  }, [content]);

  return Content;
}

export async function getStaticPaths() {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));

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
        <span>{frontMatter.date}</span>
        {toReactNode(content)}
      </div>
    </div>
  );
};

export default Post;
