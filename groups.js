const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all groups
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const groups = await Group.find(query)
            .populate('members', 'username')
            .populate('moderators', 'username');

        res.json(groups);
    } catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get featured groups
router.get('/featured', async (req, res) => {
    try {
        const groups = await Group.find({ isFeatured: true })
            .populate('members', 'username')
            .populate('moderators', 'username');

        res.json(groups);
    } catch (error) {
        console.error('Get featured groups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new group
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, category, image } = req.body;

        const group = new Group({
            name,
            description,
            category,
            image,
            moderators: [req.user.id]
        });

        await group.save();

        // Add creator as a member
        await User.findByIdAndUpdate(req.user.id, {
            $push: { joinedGroups: group._id }
        });

        res.status(201).json(group);
    } catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Join a group
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is already a member
        if (group.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        // Add user to group members
        group.members.push(req.user.id);
        await group.save();

        // Add group to user's joined groups
        await User.findByIdAndUpdate(req.user.id, {
            $push: { joinedGroups: group._id }
        });

        res.json({ message: 'Joined group successfully' });
    } catch (error) {
        console.error('Join group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Leave a group
router.post('/:id/leave', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'Not a member' });
        }

        // Remove user from group members
        group.members = group.members.filter(member => member.toString() !== req.user.id);
        await group.save();

        // Remove group from user's joined groups
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { joinedGroups: group._id }
        });

        res.json({ message: 'Left group successfully' });
    } catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 