// Handle logout
function handleLogout() {
    // Remove the token
    localStorage.removeItem('adminToken');
    // Redirect to login page
    window.location.href = '../login.html';
}

// Add event listener to logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}); 