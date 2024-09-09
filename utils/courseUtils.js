// utils/courseUtils.js
const Course = require('../models/Course');

async function findMatchingCourses(recommendations) {
  try {
    // Normalize recommendations
    const normalizedRecommendations = recommendations.map(rec => rec.trim().toLowerCase());
    
    // Fetch all courses
    const courses = await Course.find({});
    const courseTitles = courses.map(course => course.title.toLowerCase());
    
    // Find matching courses
    const matchingTitles = normalizedRecommendations.filter(rec => courseTitles.includes(rec));
    const matchingCourses = courses.filter(course => matchingTitles.includes(course.title.toLowerCase()));
    
    return matchingCourses;
  } catch (error) {
    console.error('Error finding matching courses:', error);
    throw error;
  }
}

module.exports = {findMatchingCourses};
