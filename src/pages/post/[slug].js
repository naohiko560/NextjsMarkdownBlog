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
// import { toc } from 'mdast-util-toc';
import { visit } from 'unist-util-visit';

const customCode = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p' && node.children[0].type === 'text') {
        if (
          node.children[0].value.startsWith('現在Teamsで障害が発生しています')
        ) {
          node.tagName = 'div';
          node.properties = {
            className: ['alert'],
          };
          const value = node.children[0].value.replace(/\[\/?comment\]/g, '');
          node.children = [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['alert-2'] },
              children: [{ type: 'text', value }],
            },
          ];
        }
      }
    });
  };
};

// const getToc = (options) => {
//   return (node) => {
//     const result = toc(node, options);
//     node.children = [result.map];
//   };
// };

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
    .use(customCode)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  // const toc = await unified()
  //   .use(remarkParse)
  //   .use(getToc, {
  //     heading: '目次',
  //     maxDepth: 3,
  //     tight: true,
  //   })
  //   .use(remarkRehype, { allowDangerousHtml: true })
  //   .use(rehypeStringify, { allowDangerousHtml: true })
  //   .process(content);

  return {
    props: {
      frontMatter: data,
      content: result.toString(),
      // toc: toc.toString(),
      slug: params.slug,
    },
  };
}

const MyLink = ({ children, href }) => {
  if (href == '') href = '/';
  if (href.startsWith('/')) return <Link href={href}>{children}</Link>;
  if (href.startsWith('#')) {
    return <a href={href}>{children}</a>;
  } else {
    return (
      <Link href={href} target="_black" rel="noopener noreferrer">
        {children}
      </Link>
    );
  }
  // return href.startsWith('/') || href.startsWith('#') ? (
  //   <Link href={href}>{children}</Link>
  // ) : (
  //   <Link href={href} target="_black" rel="noopener noreferrer">
  //     {children}
  //   </Link>
  // );
};

const MyImage = ({ src, alt, width, height }) => {
  return <Image src={src} alt={alt} width={width} height={height} />;
};

// ※下記コードと同じ意味
const toReactNode = (content) => {
  return unified()
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
    .processSync(content).result;
};

// ※上記コードと同じ意味
// function toReactNode(content) {
//   const [Content, setContent] = useState(Fragment);

//   useEffect(() => {
//     const processor = unified()
//       .use(rehypeParse, {
//         fragment: true,
//       })
//       .use(rehypeReact, {
//         createElement,
//         Fragment,
//         components: {
//           a: MyLink,
//           img: MyImage,
//         },
//       })
//       .processSync(content);

//     setContent(processor.result);
//   }, [content]);

//   return Content;
// }

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
        <div className="space-x-2">
          {frontMatter.category.map((category) => (
            <span key={category}>
              <Link href={`/category/${category}`}>{category}</Link>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">{toReactNode(content)}</div>
          <div className="col-span-3">
            <div
              className="sticky top-[50px]"
              // dangerouslySetInnerHTML={{ __html: toc }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
