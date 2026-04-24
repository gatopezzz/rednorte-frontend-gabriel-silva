import React, { useState } from 'react';

const Waitlist = ({ userEmail }) => {
    const [mensaje, setMensaje] = useState('');

    const handleJoin = async () => {
        try {
            // Hacemos la petición a tu segundo microservicio en el puerto 8083
            const response = await fetch('http://localhost:8083/api/waitlist/unirse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailUsuario: userEmail || 'usuario@prueba.com', // Usará el email que le pasemos o uno de prueba
                    asignatura: 'Programación Fullstack'
                })
            });

            if (response.ok) {
                setMensaje('¡Te has unido a la lista de espera con éxito!');
            } else {
                setMensaje('Hubo un problema al registrarte.');
            }
        } catch (error) {
            setMensaje('Error de conexión con el servidor Waitlist (Puerto 8083).');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '50px auto' }}>
            <h2>Panel de Alumno</h2>
            <p>Bienvenido a la plataforma.</p>
            <p>Asignatura: <strong>Programación Fullstack</strong></p>
            
            <button 
                onClick={handleJoin}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}
            >
                Unirse a la Lista de Espera
            </button>

            {/* Este mensaje aparecerá en verde si es éxito o rojo si hay error */}
            {mensaje && (
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje.includes('éxito') ? 'green' : 'red' }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
};

export default Waitlist;