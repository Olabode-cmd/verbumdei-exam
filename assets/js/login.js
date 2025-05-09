document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const studentId = document.getElementById('student_id').value;
        const sessionCode = document.getElementById('session_code').value;

        try {
            const response = await studentLogin(studentId, sessionCode);
            // Store any necessary data in sessionStorage
            sessionStorage.setItem('studentSession', JSON.stringify(response));
            // Redirect to exam page or dashboard
            window.location.href = '/exam.html';
        } catch (error) {
            errorMessage.textContent = 'Invalid credentials. Please try again.';
            errorMessage.classList.remove('hidden');
        }
    });
}); 