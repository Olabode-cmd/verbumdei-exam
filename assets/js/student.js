import { fetchStudents } from '../../assets/js/students.js';

let allStudents = [];
let selectedStudents = [];

const inputField = document.getElementById('studentSearch');
const studentDropdown = document.getElementById('studentDropdown');
const studentList = document.getElementById('studentList');
const selectedStudentList = document.getElementById('selectedStudentList');

// Fetch students on page load
(async function () {
    try {
        allStudents = await fetchStudents();
    } catch (e) {
        console.error('Error fetching students:', e);
    }
})();

// Filter and show dropdown as user types
inputField.addEventListener('input', function () {
    const query = inputField.value.toLowerCase();
    studentList.innerHTML = '';

    if (query) {
        const filtered = allStudents.filter(student =>
            (student.registration_id || student.registration_number || '').toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            studentDropdown.classList.remove('hidden');
            filtered.slice(0, 10).forEach(student => {
                const li = document.createElement('li');
                li.className = 'px-4 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2';
                li.innerHTML = `<span class="text-red-600 font-bold">${student.registration_id || student.registration_number}</span> <span>(${student.first_name} ${student.last_name})</span>`;
                li.onclick = () => {
                    if (!selectedStudents.some(s => s.registration_id === student.registration_id)) {
                        selectedStudents.push(student);
                        renderSelectedStudents();
                    }
                    inputField.value = '';
                    studentDropdown.classList.add('hidden');
                };
                studentList.appendChild(li);
            });
        } else {
            studentDropdown.classList.add('hidden');
        }
    } else {
        studentDropdown.classList.add('hidden');
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!studentDropdown.contains(e.target) && e.target !== inputField) {
        studentDropdown.classList.add('hidden');
    }
});

// Render selected students as chips
function renderSelectedStudents() {
    selectedStudentList.innerHTML = '';
    selectedStudents.forEach(student => {
        const li = document.createElement('li');
        li.className = 'flex items-center bg-blue-100 rounded px-3 py-1 text-sm mb-1 gap-2';
        li.innerHTML = `<span class="font-semibold">${student.first_name} ${student.last_name}</span> <span class="text-red-600 font-bold">${student.registration_id || student.registration_number}</span> <button type="button" class="ml-2 text-red-500 hover:text-red-700 remove-student">Remove</button>`;
        li.querySelector('.remove-student').onclick = () => {
            selectedStudents = selectedStudents.filter(s => s.registration_id !== student.registration_id);
            renderSelectedStudents();
        };
        selectedStudentList.appendChild(li);
    });
}

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