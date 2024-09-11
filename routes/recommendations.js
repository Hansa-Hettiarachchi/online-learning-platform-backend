const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();
const Course = require('../models/Course'); // Adjust path as needed

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key from environment variables
});

let requestCount = 0; // Track API request count

// Function to query GPT-3 for course recommendations
async function getCourseRecommendations(prompt, courseSummaries) {
  try {
    if (requestCount >= 250) {
      throw new Error('API request limit reached');
    }

    console.log('Request to GPT-3 with prompt:', prompt);
    console.log('Course summaries:', courseSummaries);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that suggests the best courses based on the following information.`
        },
        {
          role: 'user',
          content: `Here are some courses related to "${prompt}". Suggest the best courses:\n\n${courseSummaries}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    requestCount++;
    console.log(`API requests made: ${requestCount}`);
    console.log('Full GPT-3 Response:', JSON.stringify(response, null, 2));

    if (response.choices && response.choices.length > 0) {
      const refinedRecommendations = response.choices[0].message.content.trim();
      console.log('Refined Recommendations:', refinedRecommendations);
      return refinedRecommendations;
    } else {
      console.error('No choices found in GPT-3 response');
      return 'No recommendations were found.';
    }

  } catch (error) {
    console.error('Error fetching GPT-3 recommendations:', error.message);
    throw error;
  }
}

// Route to handle course recommendations
router.post('/recommendations', async (req, res) => {
  const { prompt } = req.body;

  try {
    console.log(`Received prompt: ${prompt}`); // Log received prompt

    // Extract keywords from the prompt
    const keywords = prompt
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
      .split(' ') // Split into words
      .filter(word => word.length > 2) // Remove short words
      .join('|'); // Join words with |
      
    console.log('Keywords for query:', keywords);

    // Create regex for querying
    const regex = new RegExp(keywords, 'i');
    console.log('Regex used for query:', regex);

    // Query the database
    const courses = await Course.find({
      $or: [
        { title: regex },
        { description: regex },
        { content: regex }
      ]
    });

    // Log found courses
    console.log('Courses found:', JSON.stringify(courses, null, 2));

    // If no courses match, return a message
    if (courses.length === 0) {
      console.log('No matching courses found.');
      return res.status(404).json({ message: 'No matching courses found.' });
    }

    // Create a summary of course titles and descriptions to send to GPT-3 for refinement
    const courseSummaries = courses.map(course => `${course.title}: ${course.description}`).join('\n');

    // Log course summaries
    console.log('Course summaries:', courseSummaries);

    // Get recommendations from GPT-3
    const refinedRecommendations = await getCourseRecommendations(prompt, courseSummaries);

    // Log refined recommendations
    console.log('Refined Recommendations:', refinedRecommendations);

    // Send the refined recommendations back to the frontend
    res.status(200).send(refinedRecommendations);

  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
