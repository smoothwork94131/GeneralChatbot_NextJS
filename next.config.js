/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  env: {
    // defaults to TRUE, unless API Keys are set at build time; this flag is used by the UI
    HAS_SERVER_KEY_OPENAI: !!process.env.OPENAI_API_KEY,
    HAS_SERVER_KEY_ELEVENLABS: !!process.env.ELEVENLABS_API_KEY,
    HAS_SERVER_KEY_PRODIA: !!process.env.PRODIA_API_KEY,
  },
  webpack(config, { isServer, dev }) {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.tls = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.child_process = false;
    }
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  experimental: {
    outputFileTracingIgnores: ['**canvas**'],
  },
};

module.exports = nextConfig;
