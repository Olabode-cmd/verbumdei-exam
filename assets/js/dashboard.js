document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const userData = getUserSession();
    if (!userData || !userData.token) {
        window.location.href = '/admin/login.html';
        return;
    }

    // Check if user role is authorized
    if (!isAuthorizedRole(userData.role)) {
        window.location.href = '/admin/unauthorized.html';
        return;
    }

    // Display admin info
    const adminEmail = document.getElementById('adminEmail');
    if (adminEmail && userData.email) {
        adminEmail.textContent = userData.email;
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearUserSession();
            window.location.href = '/admin/login.html';
        });
    }

    // Initialize dashboard data
    initializeDashboard();
});

// Initialize dashboard data
async function initializeDashboard() {
    try {
        // Here you would typically fetch dashboard data from your API
        // For now, we'll use placeholder data
        updateStats({
            totalStudents: 1234,
            activeExams: 12,
            ongoingSessions: 45,
            completedExams: 789
        });

        // Fetch and display recent activity
        // This would typically come from an API call
        const recentActivity = [
            {
                name: 'Mathematics Final Exam',
                status: 'active',
                time: '10 minutes ago',
                students: 45
            },
            {
                name: 'Science Quiz',
                status: 'completed',
                time: '1 hour ago',
                students: 32
            }
        ];
        updateRecentActivity(recentActivity);

    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Update dashboard statistics
function updateStats(stats) {
    const elements = {
        totalStudents: document.getElementById('totalStudents'),
        activeExams: document.getElementById('activeExams'),
        ongoingSessions: document.getElementById('ongoingSessions'),
        completedExams: document.getElementById('completedExams')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (element && stats[key] !== undefined) {
            element.textContent = stats[key].toLocaleString();
        }
    }
}

// Update recent activity
function updateRecentActivity(activities) {
    const recentActivityList = document.getElementById('recentActivityList');
    if (!recentActivityList) return;

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'px-6 py-4 hover:bg-gray-50';
        li.innerHTML = `
            <div class="flex items-center">
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">${activity.name}</p>
                    <p class="text-sm text-gray-500">${activity.time} • ${activity.students} students</p>
                </div>
                <div>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                    }">
                        ${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                </div>
            </div>
        `;
        recentActivityList.appendChild(li);
    });
}

// Add event listeners for quick action buttons
document.querySelectorAll('.quick-action').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        switch (action) {
            case 'create-exam':
                window.location.href = '/admin/exams/create.html';
                break;
            case 'add-students':
                window.location.href = '/admin/students/add.html';
                break;
            case 'view-reports':
                window.location.href = '/admin/reports/';
                break;
        }
    });
}); 