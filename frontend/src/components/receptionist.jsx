import React from 'react';
import { useNavigate } from 'react-router-dom';

function Receptionist(){
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return(
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Receptionist Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    Logout
                </button>
            </div>
            <p>Welcome to the Receptionist Page!</p>
            <p>You are successfully logged in as a Receptionist.</p>
        </div>
    )
}

export default Receptionist;