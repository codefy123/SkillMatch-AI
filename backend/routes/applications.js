const express = require('express');
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const { job_id, ai_score, missing_skills } = req.body;
    const studentId = req.user.userId; 
    const role = req.user.role;

    if (role !== 'student') {
        return res.status(403).json({ error: 'Only student accounts can apply for jobs.' });
    }

    try {
        const [existing] = await db.execute(
            'SELECT id FROM applications WHERE job_id = ? AND student_id = ? AND status != ?',
            [job_id, studentId, 'rejected']
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'You have already applied for this role.' });
        }

        const [jobRows] = await db.execute('SELECT min_match_score FROM jobs WHERE id = ?', [job_id]);
        if (jobRows.length === 0) {
            return res.status(404).json({ error: 'Job posting not found.' });
        }

        const minMatchScore = jobRows[0].min_match_score || 70;
        
        let initialStatus = 'pending';
        let rejectionReason1 = null;

        if (ai_score >= minMatchScore) {
            initialStatus = 'accepted';
        } else {
            initialStatus = 'rejected'; 
            
            if (missing_skills && Array.isArray(missing_skills) && missing_skills.length > 0) {
                rejectionReason1 = `Automated AI Review: Your resume scored ${ai_score}%, which is below the required baseline of ${minMatchScore}%. \n\nBased on the job description, your profile appears to be missing proficiency in the following required skills: ${missing_skills.join(', ')}. \n\nWe highly recommend acquiring these skills and updating your resume before re-applying.`;
            } else {
                rejectionReason1 = `Automated AI Review: Your resume scored ${ai_score}%, which is below the required baseline of ${minMatchScore}%. Please review the job description closely and ensure your resume highlights all required qualifications.`;
            }
        }

        const [result] = await db.execute(
            'INSERT INTO applications (job_id, student_id, ai_score, status, rejection_reason1) VALUES (?, ?, ?, ?, ?)',
            [job_id, studentId, ai_score, initialStatus, rejectionReason1]
        );

        res.status(201).json({ 
            message: initialStatus === 'accepted' ? 'Application submitted and automatically shortlisted!' : 'Application auto-rejected due to low AI match score.', 
            applicationId: result.insertId,
            status: initialStatus,
            rejection_reason1: rejectionReason1
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Failed to submit application to the database.' });
    }
});

router.get('/hr', verifyToken, async (req, res) => {
    const hrId = req.user.userId;

    if (req.user.role !== 'hr') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const query = `
            SELECT 
                a.id, a.ai_score, a.status, a.created_at, a.rejection_reason1,
                j.id as job_id, j.title as job_title, j.min_match_score,
                u.id as student_id, u.email as student_email
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN users u ON a.student_id = u.id
            WHERE j.hr_id = ?
            ORDER BY a.ai_score DESC
        `;
        
        const [applications] = await db.execute(query, [hrId]);
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching HR pipeline:', error);
        res.status(500).json({ error: 'Failed to fetch pipeline' });
    }
});

router.get('/me', verifyToken, async (req, res) => {
    const studentId = req.user.userId;

    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const query = `
            SELECT 
                a.id, a.ai_score, a.status, a.created_at, a.rejection_reason1,
                j.title as job_title, j.description, j.min_match_score
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.student_id = ?
            ORDER BY a.created_at DESC
        `;
        
        const [applications] = await db.execute(query, [studentId]);
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching student applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

router.put('/:id/status', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status, rejection_reason1 } = req.body;
    const hrId = req.user.userId;

    if (req.user.role !== 'hr') {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const [authCheck] = await db.execute(`
            SELECT a.id FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = ? AND j.hr_id = ?
        `, [id, hrId]);

        if (authCheck.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to modify this application' });
        }

        const reason = rejection_reason1 || null;
        await db.execute('UPDATE applications SET status = ?, rejection_reason1 = ? WHERE id = ?', [status, reason, id]);
        
        res.json({ message: `Application marked as ${status}` });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;