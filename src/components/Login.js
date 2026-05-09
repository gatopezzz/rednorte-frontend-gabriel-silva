import React, { useState } from 'react';

const Login = ({ onLoginExitoso, irARegistro }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                localStorage.setItem('especialidad', data.especialidad);

                setMensaje('Login exitoso');

                setTimeout(() => {
                    onLoginExitoso(email, data.rol, data.especialidad);
                }, 1500);
            } else {
                setMensaje('Correo o contraseña incorrectos.');
            }
        } catch (error) {
            setMensaje('Error de conexión con el servidor backend');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
            <h2>Iniciar Sesión - RedNorte</h2>

            <div style={{ marginBottom: '15px' }}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', width: '90%', marginBottom: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', width: '90%' }}
                />
            </div>

            <button
                onClick={handleLogin}
                style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '95%' }}
            >
                Ingresar
            </button>

            {mensaje && (
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje === 'Login exitoso' ? 'green' : 'red' }}>
                    {mensaje}
                </p>
            )}

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button
                    onClick={irARegistro}
                    style={{ padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                    ¿No tienes cuenta? Regístrate aquí
                </button>
            </div>
        </div>
    );
};

export default Login;