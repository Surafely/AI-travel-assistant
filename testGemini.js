const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});

const { generateResponse } = require('./services/ai/gemini');

(async () => {
  const response = await generateResponse(
    'Plan a 3-day trip to Ethiopia. with a low cost possible',
  );

  console.log(response);
})();
