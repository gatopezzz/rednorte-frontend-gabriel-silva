import React, { useState } from 'react';

const Waitlist = ({ userEmail }) => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);

    const unirseALista = () => {
        const nuevaEntrada = {
            email: userEmail,
            estado: 'Pendiente'
        };

        fetch('http://localhost:8083/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaEntrada)
        })
        .then(res => {
            if (res.ok) {
                setMensaje('¡Te has unido a la lista de espera con éxito!');
                setError(false);
            } else {
                setMensaje('Error al unirse a la lista.');
                setError(true);
            }
        })
        .catch(err => {
            console.error("Error:", err);
            setMensaje('Error de conexión con el servidor.');
            setError(true);
        });
    };

    return (
        <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '10px', textAlign: 'center', backgroundColor: 'white', maxWidth: '400px' }}>
            <h2>Panel de Pacientes</h2>
            <p>Bienvenido a la plataforma RedNorte.</p>
            
            <button 
                onClick={unirseALista} 
                style={{ backgroundColor: '#27ae60', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}
            >
                Unirse a la Lista de Espera
            </button>

            {mensaje && (
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: error ? '#e74c3c' : '#27ae60' }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
};

export default Waitlist;