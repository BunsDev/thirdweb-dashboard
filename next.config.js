const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com unpkg.com;
  font-src 'self' fonts.gstatic.com;
  frame-src *;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.thirdweb.com vercel.live;
  connect-src * data:;
  block-all-mixed-content;
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import('next').NextConfig} */
const moduleExports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/portal/:match*",
        destination: "https://portal.thirdweb.com/:match*",
        permanent: true,
      },
      {
        source: "/dashboard/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/dashboard/mumbai/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/thirdweb_Privacy_Policy_May_2022.pdf",
        permanent: false,
      },
      {
        source: "/tos",
        destination: "/Thirdweb_Terms_of_Service.pdf",
        permanent: false,
      },
      {
        source: "/contracts/publish",
        destination: "/contracts/release",
        permanent: false,
      },
      {
        source: "/authentication",
        destination: "/auth",
        permanent: false,
      },
      {
        source: "/extensions",
        destination: "/contractkit",
        permanent: false,
      },
      //  old (deprecated) routes
      {
        source:
          "/:network/(edition|nft-collection|token|pack|nft-drop|signature-drop|edition-drop|token-drop|marketplace|split|vote)/:address",
        destination: "/:network/:address",
        permanent: false,
      },
      // prebuilt contract deploys
      {
        source: "/contracts/new/:slug*",
        destination: "/explore",
        permanent: false,
      },
      // deployer to non-deployer url
      {
        source: "/deployer.buns.eth",
        destination: "/buns.eth",
        permanent: false,
      },
      {
        source: "/deployer.buns.eth/:path*",
        destination: "/buns.eth/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/buns.eth",
        destination: "/deployer.buns.eth",
      },
      {
        source: "/buns.eth/:path*",
        destination: "/deployer.buns.eth/:path*",
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["thirdweb.com", "portal.thirdweb.com", "blog.thirdweb.com"],
  },
  reactStrictMode: true,
  experimental: {
    // appDir: true,
    scrollRestoration: true,
  },
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
