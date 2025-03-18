const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://the-trivia-api.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/v2', // rewrite /api to /v2 when forwarding to the target
      },
    })
  );
};