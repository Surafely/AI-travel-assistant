const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
