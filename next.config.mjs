import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // 폴링 간격을 1초로 설정
        aggregateTimeout: 300, // 변경 감지 후 다시 빌드하기 전 대기 시간
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  // await setupDevPlatform();
}

export default nextConfig;
