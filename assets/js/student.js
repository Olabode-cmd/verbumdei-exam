document.addEventListener('DOMContentLoaded', () => {
    const studentLoginForm = document.getElementById('studentLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = studentLoginForm.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.innerHTML;

    studentLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        setLoading(true);
        hideError();
        
        const studentId = document.getElementById('student_id').value;
        const sessionCode = document.getElementById('session_code').value;

        try {
            // Fetch exam session details
            const sessionData = await getStudentSession(studentId, sessionCode);
            
            // Store session data
            sessionStorage.setItem('examSession', JSON.stringify(sessionData));
            
            // Show success message
            showToast('Session verified successfully! Redirecting to exam...', 'success');
            
            // Redirect to exam page after delay
            setTimeout(() => {
                window.location.href = '/exam.html';
            }, 1000);

        } catch (error) {
            showError(error.message);
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    });

    // Helper functions
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<i class="fas fa-spinner fa-spin mr-2"></i>Verifying session...' : 
            submitButtonText;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
}); 