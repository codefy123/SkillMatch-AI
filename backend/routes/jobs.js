const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const { title, description, min_match_score } = req.body;
    const hrId = req.user.userId; 
    const role = req.user.role;

    if (role !== 'hr') {
        return res.status(403).json({ error: 'Only HR accounts can post jobs.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO jobs (hr_id, title, description, min_match_score, status) VALUES (?, ?, ?, ?, ?)',
            [hrId, title, description, min_match_score, 'active']
        );

        res.status(201).json({ 
            message: 'Job posted successfully', 
            jobId: result.insertId 
        });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', verifyToken, async (req, res) => {
    const hrId = req.user.userId;

    if (req.user.role !== 'hr') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const [jobs] = await db.execute(
            'SELECT * FROM jobs WHERE hr_id = ? ORDER BY created_at DESC',
            [hrId]
        );
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching HR jobs:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/active', verifyToken, async (req, res) => {
    try {
        const [jobs] = await db.execute(
            "SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC"
        );
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching active jobs:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [jobs] = await db.execute('SELECT * FROM jobs WHERE id = ?', [id]);
        
        if (jobs.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json(jobs[0]);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/status', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const hrId = req.user.userId;

    if (req.user.role !== 'hr') return res.status(403).json({ error: 'Access denied' });

    try {
        const [result] = await db.execute(
            'UPDATE jobs SET status = ? WHERE id = ? AND hr_id = ?',
            [status, id, hrId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found or unauthorized.' });
        }

        res.json({ message: `Job status updated to ${status}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const hrId = req.user.userId;

    if (req.user.role !== 'hr') return res.status(403).json({ error: 'Access denied' });

    try {
        const [result] = await db.execute(
            'DELETE FROM jobs WHERE id = ? AND hr_id = ?',
            [id, hrId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found or unauthorized.' });
        }

        res.json({ message: 'Job successfully deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;