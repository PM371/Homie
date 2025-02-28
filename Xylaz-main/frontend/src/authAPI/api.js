// API URL ที่ดึงมาจาก environment variables (กำหนดไว้ใน .env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/';

// ฟังก์ชันสำหรับการ Login
export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/signin`, { // เปลี่ยน URL ให้ถูกต้อง
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};

// ฟังก์ชันสำหรับการ Signup
export const signup = async (data) => {
    const response = await fetch(`${API_URL}/signup`, { // เปลี่ยน URL ให้ถูกต้อง
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return response.json();
};
