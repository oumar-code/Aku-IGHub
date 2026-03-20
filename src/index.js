const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('IG Hub service is running!');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`IG Hub service listening on port ${port}`);
  });
}

module.exports = app;