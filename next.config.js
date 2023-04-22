/** @type {import('next').NextConfig} */

const branchName = process.env.BRANCH_NAME ? '/' + process.env.BRANCH_NAME : '';

const urlPrefix = '/NextjsMarkdownBlog';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  assetPrefix: branchName,
  basePath: urlPrefix,
  trailingSlash: true,
};

module.exports = nextConfig;
