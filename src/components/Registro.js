import React, { useState } from 'react';

const Registro = () => {
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        email: '',
        password: '',
        rol: 'PACIENTE'
    });
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.text();
            setMensaje(data);
        } catch (error) {
            setMensaje('Error de conexión con el servidor backend');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2>Crear Cuenta - RedNorte</h2>
            <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="rut" placeholder="RUT (ej: 19.123.456-7)" onChange={handleChange} required style={{ padding: '10px' }} />
                <input type="text" name="nombre" placeholder="Nombre completo" onChange={handleChange} required style={{ padding: '10px' }} />
                <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required style={{ padding: '10px' }} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Registrarse
                </button>
            </form>
            {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje.includes('Error') ? 'red' : 'green' }}>{mensaje}</p>}
        </div>
    );
};

export default Registro;