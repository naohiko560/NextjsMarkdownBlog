/** @type {import('next').NextConfig} */

const branchName = process.env.BRANCH_NAME
  ? '/NextjsMarkdownBlog' + process.env.BRANCH_NAME
  : '';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  assetPrefix: branchName,
  basePath: branchName,
};

module.exports = nextConfig;
