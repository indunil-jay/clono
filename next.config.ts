import { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'require("reflect-metadata");',
          raw: true,
          entryOnly: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
