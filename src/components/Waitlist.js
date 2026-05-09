import React, { useState } from 'react';

const Waitlist = ({ userEmail }) => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);
    const [especialidad, setEspecialidad] = useState('');

    const unirseALista = () => {
        if (!especialidad) {
            setMensaje('Por favor, selecciona una especialidad primero.');
            setError(true);
            return;
        }

        const nuevaEntrada = {
            email: userEmail,
            especialidad: especialidad,
            estado: 'PENDIENTE'
        };

        const token = localStorage.getItem('token');

        // Pasamos por el Gateway (8082) en lugar del puerto directo
        fetch('http://localhost:8082/api/waitlist/unirse', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(nuevaEntrada)
        })
        .then(res => {
            if (res.ok) {
                setMensaje(`¡Te has unido a la lista de espera de ${especialidad.replace('_', ' ')} con éxito!`);
                setError(false);
            } else if (res.status === 401) {
                setMensaje('Error de seguridad: Tu sesión expiró o no es válida.');
                setError(true);
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
            
            <div style={{ marginTop: '20px', marginBottom: '15px' }}>
                <select 
                    value={especialidad} 
                    onChange={(e) => setEspecialidad(e.target.value)}
                    style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="" disabled>Seleccione una especialidad...</option>
                    <option value="MEDICINA_GENERAL">Medicina General</option>
                    <option value="CARDIOLOGIA">Cardiología</option>
                    <option value="TRAUMATOLOGIA">Traumatología</option>
                    <option value="PEDIATRIA">Pediatría</option>
                </select>
            </div>

            <button 
                onClick={unirseALista} 
                style={{ backgroundColor: '#27ae60', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
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