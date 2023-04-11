import fs from 'fs';

export async function getStaticProps() {
  return { props: { post: '' } };
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
  }
}

const Post = () => {
  return <div>コンテンツ</div>;
};

export default Post;
