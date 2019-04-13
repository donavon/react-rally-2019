const express = require('express');
const cors = require('cors');
const proxy = require('http-proxy-middleware');

const port = 2000;
const app = express();

app.use('/api/releases', () => {
  return proxy({
    target: 'https://api.tito.io/v3/trace-events/react-rally-2019/releases',
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
    onProxyReq: proxyReq => {
      proxyReq.setHeader(
        'Authorization',
        'Token token=' + process.env.TITO_ACCESS_TOKEN,
      );
    },
  });
});

app.use(cors());
app.use(express.static('./'));

app.listen(port, () => {
  console.log('Server is running on port' + port);
});
