const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const { category, level, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (level) {
            query.level = level;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .populate('enrolledStudents', 'username')
            .populate('reviews.user', 'username');

        res.json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get featured courses
router.get('/featured', async (req, res) => {
    try {
        const courses = await Course.find({ isFeatured: true })
            .populate('enrolledStudents', 'username')
            .populate('reviews.user', 'username');

        res.json(courses);
    } catch (error) {
        console.error('Get featured courses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        // Add user to enrolled students
        course.enrolledStudents.push(req.user.id);
        await course.save();

        // Add course to user's enrolled courses
        await User.findByIdAndUpdate(req.user.id, {
            $push: { enrolledCourses: course._id }
        });

        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Enroll error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a review
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ message: 'Must be enrolled to review' });
        }

        // Check if user has already reviewed
        const existingReview = course.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (existingReview) {
            return res.status(400).json({ message: 'Already reviewed' });
        }

        // Add review
        course.reviews.push({
            user: req.user.id,
            rating,
            comment
        });

        // Update average rating
        await course.calculateAverageRating();

        res.json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 