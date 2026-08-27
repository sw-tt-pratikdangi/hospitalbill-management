// server/code-assistant/assistant.js
const express = require('express');
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(express.json());

const SYSTEM_CONTEXT = `
You are an expert AI coding assistant for the Hospital Bill Management System (HBMS).
Stack: Node.js / Express backend, Angular (TypeScript) frontend, MongoDB with Mongoose database.
Core modules: Patients, Services, Bills, Payments, Authentication, and Code Assistant.
Follow REST API conventions, standard Angular/TypeScript guidelines, and match the project's folder structure.
`;

router.post('/ask', async (req, res) => {
    const { question, codeContext } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ error: 'Please enter a question.' });
    }

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.1',
                prompt: `${SYSTEM_CONTEXT}\n\nContext code:\n${codeContext || ''}\n\nQuestion: ${question}`,
                stream: false
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: 'Ollama request failed',
                details: errData.error || `Ollama returned status ${response.status}`
            });
        }

        const data = await response.json();
        if (!data || !data.response) {
            return res.status(500).json({ error: 'Empty response received from Ollama model.' });
        }

        res.json({ answer: data.response });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to connect to local Ollama instance (http://localhost:11434).',
            details: err.message
        });
    }
});

module.exports = router;