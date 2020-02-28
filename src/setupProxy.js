const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/1.0/app', {
    target: "http://210.74.12.38:1111",
    changeOrigin: true,
  })
  );
  app.use(proxy('/httpAPIv2.php', {
    target: "https://www.aex88.com",
    changeOrigin: true,
  })
  );
};