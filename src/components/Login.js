import React, { useState } from 'react';

const Login = ({ onLoginExitoso, irARegistro }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleLogin = async () => {
        try {
            // Hacemos la petición pasando por el proxy
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Como tu backend de Java devuelve texto normal y no un JSON, usamos text()
            const text = await response.text();

            // Verificamos si el texto del backend tiene la palabra clave de éxito
            if (text.includes('Login exitoso')) {
                setMensaje(text); // Mostramos el mensaje verde
                
                // --- MAGIA DE REDIRECCIÓN POR ROL ---
                setTimeout(() => {
                    // Diferenciamos si es el admin que inyectamos o un usuario normal
                    if (email === 'admin@gmail.com') {
                        onLoginExitoso(email, 'ADMIN'); // Avisamos a App.js que entró el ADMIN
                    } else {
                        onLoginExitoso(email, 'USER');  // Avisamos a App.js que entró un USER normal
                    }
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

            {/* Mensaje de estado (Verde para éxito, rojo para error) */}
            {mensaje && (
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje.includes('exitoso') ? 'green' : 'red' }}>
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