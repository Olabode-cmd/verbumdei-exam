// assets/js/quiz.js

// Fetch all quizzes
export async function fetchQuizzes() {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('https://service.verbumdeiportal.com/etest/quizzes/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to fetch quizzes');
    }
    return response.json();
}

// Upload a new question
export async function uploadQuestion({ text, quiz, options }) {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('https://service.verbumdeiportal.com/etest/questions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text, quiz, options })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to upload question');
    }
    return response.json();
}

// Additional quiz-related functions can be added here (edit, delete, etc.) 