const express = require('express');
const auth = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const router = express.Router();

// Create Course (Only Instructors)
router.post('/create', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access denied' });

    const { title, description, content } = req.body;
    const course = new Course({ title, description, content, instructor: req.user.id });
    await course.save();
    res.status(201).json({ message: 'Course created', course });
});

// Get All Courses
router.get('/', async (req, res) => {
    const courses = await Course.find().populate('instructor', 'username');
    res.json(courses);
});

// Get a Course by ID
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).populate('instructor', 'username');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
});

// Update Course (Only Instructors)
router.put('/:id', auth, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.id !== course.instructor.toString()) return res.status(403).json({ message: 'Access denied' });

    const { title, description, content } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.content = content || course.content;

    await course.save();
    res.json({ message: 'Course updated', course });
});

// Delete Course (Only Instructors)
router.delete('/:id', auth, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.id !== course.instructor.toString()) return res.status(403).json({ message: 'Access denied' });

    // Use findByIdAndDelete instead of remove
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
});
module.exports = router;