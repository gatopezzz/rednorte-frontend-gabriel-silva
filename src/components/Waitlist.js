import React, { useState, useEffect } from 'react';

const Waitlist = ({ emailPaciente }) => {
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);
    const [especialidad, setEspecialidad] = useState('');
    const [correoUsuario, setCorreoUsuario] = useState('');

    const extraerCorreoDelToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            return decoded.sub || decoded.email || ''; 
        } catch (e) {
            console.error("Error al decodificar el token:", e);
            return '';
        }
    };

    useEffect(() => {
        if (emailPaciente) {
            setCorreoUsuario(emailPaciente);
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                const correo = extraerCorreoDelToken(token);
                setCorreoUsuario(correo);
            }
        }
    }, [emailPaciente]);

    const unirseALista = () => {
        if (!especialidad) {
            setMensaje('Por favor, selecciona una especialidad primero.');
            setError(true);
            return;
        }

        if (!correoUsuario) {
            setMensaje('Error: No pudimos detectar para quién es esta solicitud.');
            setError(true);
            return;
        }

        const nuevaEntrada = {
            email: correoUsuario, 
            especialidad: especialidad,
            estado: 'PENDIENTE'
        };

        const token = localStorage.getItem('token');

        fetch('http://localhost:8082/api/waitlist/unirse', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(nuevaEntrada)
        })
        .then(async res => { 
            if (res.ok) {
                setMensaje(
                    emailPaciente 
                    ? `✅ ¡El paciente ha sido inscrito en ${especialidad.replace('_', ' ')}!`
                    : `¡Te has unido a la lista de espera de ${especialidad.replace('_', ' ')} con éxito!`
                );
                setError(false);
            } else if (res.status === 401) {
                setMensaje('Error de seguridad: Tu sesión expiró o no es válida.');
                setError(true);
            } else if (res.status === 409) {
                setMensaje(
                    emailPaciente 
                    ? 'El paciente ya se encuentra en esta lista de espera.'
                    : 'Ya te encuentras en la lista de espera para esta especialidad.'
                );
                setError(true);
            } else {
                const errorDelBackend = await res.text();
                setMensaje(`Error del servidor (${res.status}): ${errorDelBackend}`);
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
        <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '10px', textAlign: 'center', backgroundColor: 'white', maxWidth: '400px', margin: '10px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                {emailPaciente ? "🏥 Inscribir Paciente" : "Panel de Pacientes"}
            </h2>
            <p style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
                {emailPaciente ? `Agendando para: ${correoUsuario}` : "Bienvenido a la plataforma RedNorte."}
            </p>
            
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
                {emailPaciente ? "Añadir a Lista de Espera" : "Unirse a la Lista de Espera"}
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