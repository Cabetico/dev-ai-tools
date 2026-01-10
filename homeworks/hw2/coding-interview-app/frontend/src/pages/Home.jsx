import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const createSession = async () => {
        setLoading(true);
        try {
            // Assume backend is on port 3000
            const response = await axios.post('http://localhost:3000/api/sessions', {
                language: 'javascript'
            });
            const { id } = response.data;
            navigate(`/room/${id}`);
        } catch (error) {
            console.error("Failed to create session", error);
            alert("Failed to create session. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CodeInterview
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>
                Premium Real-time Coding Interviews for Everyone.
            </p>
            <button className="btn-primary" onClick={createSession} disabled={loading} style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                {loading ? 'Creating...' : 'Start New Interview'}
            </button>
        </div>
    );
};

export default Home;
