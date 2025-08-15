"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function OurTutorsPage() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/api/tutors/`);
                setTutors(response.data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (    
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Tutors</h1>
            <p className="text-gray-600">Meet our expert tutors who are passionate about teaching and helping students succeed.</p>
        </div>
    );
}