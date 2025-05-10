// Check if user is authenticated
function checkAuth() {
    // Don't check auth on non-login pages
    if (!window.location.pathname.includes('login.html')) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            // Use relative path to login page based on current path depth
            const pathParts = window.location.pathname.split('/');
            const depth = pathParts.filter(part => part.length > 0).length - 1;
            const relativePath = depth > 1 ? '../'.repeat(depth - 1) + 'login.html' : 'login.html';
            window.location.href = relativePath;
            return false;
        }
    }
    return true;
}

// Run auth check when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});