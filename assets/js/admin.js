document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = adminLoginForm.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.innerHTML;

    // Initialize form without automatic redirection for logged-in users
    const userData = getUserSession();

    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        setLoading(true);
        hideError();
        
        const personId = document.getElementById('person_id').value;
        const password = document.getElementById('password').value;

        try {
            const response = await login({ 
                person_id: personId,
                password: password
            });

            // Store user data and token
            storeUserSession(response);
            localStorage.setItem('adminToken', response.token);
            
            // Show success message
            showToast(`Welcome back, ${response.first_name}!`, 'success');
            
            // Handle user based on role after delay
            setTimeout(() => {
                handleAuthenticatedUser(response);
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
            '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...' : 
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

function handleAuthenticatedUser(userData) {
    if (isAuthorizedRole(userData.role)) {
        // Redirect to dashboard if role is authorized
        window.location.href = 'dashboard/index.html';
    } else {
        // Redirect to unauthorized page
        window.location.href = 'unauthorized.html';
    }
}