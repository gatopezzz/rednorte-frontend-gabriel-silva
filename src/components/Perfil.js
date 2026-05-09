import React, { useState } from 'react';

const Perfil = ({ userEmail, alActualizar }) => {
    const [email, setEmail] = useState(userEmail);
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const validarDatos = () => {
        if (email.trim().length < 12 || !email.includes('@')) return "El correo debe tener al menos 12 caracteres y ser válido.";
        if (nombre && nombre.trim().length < 3) return "El nombre es demasiado corto.";
        
        const passwordValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (password && !passwordValida.test(password)) {
            return "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
        }
        return null;
    };

    const handleUpdate = async () => {
        const err = validarDatos();
        if (err) { setError(err); return; }

        try {
            const response = await fetch('http://localhost:8082/api/auth/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    currentEmail: userEmail, 
                    newEmail: email, 
                    nombre, 
                    password 
                })
            });

            if (response.ok) {
                setMensaje('Perfil actualizado. Si cambiaste tu correo, los cambios se reflejarán en tu próximo inicio de sesión.');
                setError('');
                setTimeout(() => alActualizar(), 2000);
            } else {
                const text = await response.text();
                setError(text || 'No se pudo actualizar el perfil.');
            }
        } catch (err) {
            setError('Error de conexión.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Mi Perfil</h2>
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Gestiona tu información personal</p>
            
            <div style={{ marginBottom: '15px' }}>
                <label>Correo Electrónico:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={inputStyle} 
                />
                
                <label>Nuevo Nombre (Opcional):</label>
                <input 
                    type="text" 
                    placeholder="Dejar en blanco para no cambiar" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    style={inputStyle} 
                />

                <label>Nueva Contraseña (Opcional):</label>
                <input 
                    type="password" 
                    placeholder="Dejar en blanco para no cambiar" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={inputStyle} 
                />
            </div>

            <button onClick={handleUpdate} style={btnStyle}>Guardar Cambios</button>
            <button onClick={alActualizar} style={btnVolverStyle}>Cancelar / Volver</button>

            {error && <p style={{ color: '#e74c3c', marginTop: '10px', fontWeight: 'bold' }}>❌ {error}</p>}
            {mensaje && <p style={{ color: '#27ae60', marginTop: '10px', fontWeight: 'bold' }}>✅ {mensaje}</p>}
        </div>
    );
};

const inputStyle = { width: '95%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const btnVolverStyle = { ...btnStyle, backgroundColor: 'transparent', color: '#7f8c8d', border: '1px solid #ddd', marginTop: '10px' };

export default Perfil;