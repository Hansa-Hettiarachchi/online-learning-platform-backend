// const { OpenAI } = require('openai');
// require('dotenv').config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// let requestCount = 0;

// async function getCourseRecommendations(prompt) {
//   try {
//     if (requestCount >= 250) {
//       throw new Error('API request limit reached');
//     }

//     const response = await openai.completions.create({
//       model: 'gpt-3.5-turbo',
//       prompt: prompt,
//       max_tokens: 150,
//     });

//     requestCount++;
//     console.log(`API requests made: ${requestCount}`);
    
//     return response.choices[0].text.trim();
//   } catch (error) {
//     console.error('Error fetching GPT-3 completion:', error);
//     throw error;
//   }
// }

// module.exports = { getCourseRecommendations };



const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let requestCount = 0;

async function getCourseRecommendations(prompt) {
  try {
    if (requestCount >= 250) {
      throw new Error('API request limit reached');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Ensure you're using the correct model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    requestCount++;
    console.log('GPT-3 Response:', response); // Log the full response
    console.log(`API requests made: ${requestCount}`);
    // Log the entire response object
    console.log('GPT-3 Response:', JSON.stringify(response, null, 2));

    // Extract and log the content of the message
    const responseText = response.choices[0].message.content.trim();
    console.log('Response Content:', responseText);
    
    return responseText;
  } catch (error) {
    console.error('Error fetching GPT-3 completion:', error);
    throw error;
  }
}

module.exports = { getCourseRecommendations };
