const express = require('express');
const app = express();
app.use(express.static('./dist/budget/browser/'));
app.get('/*', (req, res) =>
  res.sendFile('index.html', { root: 'dist/budget/browser' }),
);
app.listen(process.env.PORT || 8080);
