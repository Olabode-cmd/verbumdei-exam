export async function fetchStudents() {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('https://service.verbumdeiportal.com/student/students/', {
        headers: { 'Authorization': `Token ${token}` }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to fetch students');
    }
    console.log(res.json());
    return res.json();
}