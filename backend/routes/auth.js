const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
router.post('/signup', async (req, res) => {
    const { email, password, role, companyName } = req.body;

    try {
        const [existing] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email in use' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (email, password_hash, role, company_name) VALUES (?, ?, ?, ?)',
            [email, passwordHash, role, companyName || null]
        );

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error('🔥 Signup Error:', error); 
        
        res.status(500).json({ error: 'Server error during signup. Check backend terminal.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            company: user.company_name
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: payload });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;