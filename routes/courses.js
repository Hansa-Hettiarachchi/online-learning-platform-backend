const express = require('express');
const auth = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();

// Create Course (Only Instructors)
router.post('/create', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access denied' });

    const { title, description, content } = req.body;
    const course = new Course({ title, description, content, instructor: req.user.id });
    await course.save();
    res.status(201).json({ message: 'Course created', course });
});

// Get All Courses Posted by Instructor
router.get('/my-courses', auth, async (req, res) => {
    if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Access denied' });

    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Enrolled Students for a Course
router.get('/:id/enrolled-students', auth, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.id !== course.instructor.toString()) return res.status(403).json({ message: 'Access denied' });

    // Fetch details of enrolled students (assuming you have this data)
    const students = await User.find({ _id: { $in: course.enrolledStudents } });
    res.json(students);
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

router.post('/enroll/:courseId', auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.id;

        // Fetch the course by ID
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Add the course to the user's enrolledCourses array
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if user is already enrolled
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Enroll user in course
        course.enrolledStudents.push(userId);
        await course.save();

        // Also add the course to the user's enrolledCourses array
        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(200).json({ message: 'Successfully enrolled in course', course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:courseId/enrolled-students', auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.id;

        // Fetch the course by ID
        const course = await Course.findById(courseId).populate('enrolledStudents', 'username email'); // Populate details of enrolled students
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check if the user is the instructor for this course
        if (req.user.role !== 'instructor' || course.instructor.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Return the enrolled students
        res.json(course.enrolledStudents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/enrolled', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        console.log(`User ID from request: ${userId}`);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const user = await User.findById(userId).populate('enrolledCourses');
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log(`Enrolled courses for user: ${JSON.stringify(user.enrolledCourses)}`);
        res.json(user.enrolledCourses);
    } catch (err) {
        console.error('Error in /enrolled endpoint:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;