import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.text();
            setMensaje(data);
        } catch (error) {
            setMensaje('Error de conexión con el servidor backend');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2>Iniciar Sesión - RedNorte</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
                    Ingresar
                </button>
            </form>
            {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
        </div>
    );
};

export default Login;