import React, { useEffect, useState, useCallback } from 'react';
import tutoria from './Turoria';
import Waitlist from './Waitlist'; // 1️⃣ Importamos el componente Waitlist

const SolicitudesPaciente = ({ miUsuarioId, trigger }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [mensaje, setMensaje] = useState('');

    // Estados para el Panel de Administración del Tutor
    const [pacienteAAdministrar, setPacienteAAdministrar] = useState(null);
    const [formEmail, setFormEmail] = useState('');
    const [formNombre, setFormNombre] = useState('');
    const [formEdad, setFormEdad] = useState('');
    const [formPassword, setFormPassword] = useState('');

    const cargarSolicitudes = useCallback(async () => {
        try {
            const res = await tutoria.obtenerPendientes(miUsuarioId);
            setSolicitudes(res.data);
        } catch (error) {
            console.error("Error al cargar solicitudes", error);
        }
    }, [miUsuarioId]);

    useEffect(() => {
        if (miUsuarioId) {
            cargarSolicitudes();
        }
    }, [miUsuarioId, cargarSolicitudes, trigger]);

    const manejarRespuesta = async (idSolicitud, aceptada) => {
        setMensaje('');
        try {
            await tutoria.responderSolicitud(idSolicitud, aceptada);
            setMensaje(aceptada ? '✅ Solicitud aceptada con éxito.' : '❌ Solicitud rechazada.');
            cargarSolicitudes();
        } catch (error) {
            setMensaje('Error al procesar la respuesta.');
        }
    };

    const cancelarTutoria = async (idSolicitud) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas cancelar esta tutoría?");
        if (!confirmacion) return;

        setMensaje('');
        try {
            if (tutoria.eliminarSolicitud) {
                await tutoria.eliminarSolicitud(idSolicitud);
            } else {
                await tutoria.responderSolicitud(idSolicitud, false);
            }

            setMensaje('🗑️ Tutoría cancelada.');
            cargarSolicitudes();
            cerrarAdministracion(); 
        } catch (error) {
            console.error(error);
            setMensaje('Error al cancelar la tutoría.');
        }
    };

    const abrirAdministracion = (solicitud) => {
        setPacienteAAdministrar(solicitud);
        setFormEmail(solicitud.emailPaciente || solicitud.emailReceptor || '');
        setFormNombre(solicitud.nombrePaciente || solicitud.nombreReceptor || '');
        setFormEdad(solicitud.edadPaciente || '');
        setFormPassword('');
    };

    const cerrarAdministracion = () => {
        setPacienteAAdministrar(null);
    };

    // 2️⃣ Conexión real con tu API para guardar cambios del paciente
    const guardarCambiosPaciente = async (e) => {
        e.preventDefault();
        
        const originalEmail = pacienteAAdministrar.emailPaciente || pacienteAAdministrar.emailReceptor;

        const bodyData = {
            originalEmail: originalEmail,
            email: formEmail,
            nombre: formNombre,
            edad: formEdad ? parseInt(formEdad, 10) : null,
            password: formPassword ? formPassword : null,
            rol: 'PACIENTE' // Mantenemos el rol original
        };

        try {
            const response = await fetch('http://localhost:8082/api/auth/users/update-admin', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                alert(`✅ Cambios guardados exitosamente para ${formNombre}`);
                cerrarAdministracion();
                cargarSolicitudes(); // Recargamos para reflejar cambios de nombre/correo
            } else {
                const errorText = await response.text();
                alert(`❌ Error al actualizar: ${errorText}`);
            }
        } catch (error) {
            console.error("Error actualizando paciente:", error);
            alert("Error de conexión al servidor.");
        }
    };

    return (
        <div style={{ marginTop: '20px', width: '100%', maxWidth: '500px' }}>
            <h3>Notificaciones de Tutoría</h3>

            {mensaje && <p style={{ fontWeight: 'bold', marginBottom: '15px', color: '#2c3e50' }}>{mensaje}</p>}

            {solicitudes.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No tienes solicitudes o notificaciones de tutoría activas.</p>
            ) : (
                solicitudes.map(solicitud => {
                    const esRemitente = String(solicitud.idSolicitante) === String(miUsuarioId);

                    return (
                        <div key={solicitud.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            {esRemitente ? (
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Mis Solicitudes Enviadas</h4>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>
                                        <strong>Paciente:</strong> {solicitud.nombrePaciente || solicitud.nombreReceptor || 'Sin Nombre'}<br />
                                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{solicitud.emailPaciente || solicitud.emailReceptor || ''}</span>
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            color: solicitud.estado === 'ACEPTADA' ? '#27ae60' : solicitud.estado === 'RECHAZADA' ? '#e74c3c' : '#f39c12'
                                        }}>
                                            {solicitud.estado === 'ACEPTADA' && '✅ Aceptada'}
                                            {solicitud.estado === 'RECHAZADA' && '❌ Rechazada'}
                                            {(solicitud.estado === 'PENDIENTE' || !solicitud.estado) && '⏳ Pendiente'}
                                        </span>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {solicitud.estado === 'ACEPTADA' && (
                                                <button
                                                    onClick={() => abrirAdministracion(solicitud)}
                                                    style={{ padding: '8px 12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                >
                                                    ⚙️ Administrar
                                                </button>
                                            )}
                                            {solicitud.estado !== 'ACEPTADA' && (
                                                <button
                                                    onClick={() => cancelarTutoria(solicitud.id)}
                                                    style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                    title="Cancelar Solicitud"
                                                >
                                                    🗑️ Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                        <strong>¡Alguien quiere ser tu tutor!</strong><br />
                                        ID del solicitante: {solicitud.idSolicitante}
                                    </p>

                                    {(solicitud.estado === 'PENDIENTE' || !solicitud.estado) ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => manejarRespuesta(solicitud.id, true)} style={{ flex: 1, padding: '8px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Aceptar
                                            </button>
                                            <button onClick={() => manejarRespuesta(solicitud.id, false)} style={{ flex: 1, padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                Rechazar
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', color: solicitud.estado === 'ACEPTADA' ? '#27ae60' : '#e74c3c' }}>
                                                {solicitud.estado === 'ACEPTADA' ? '✅ Ya aceptaste esta tutoría' : '❌ Rechazaste esta tutoría'}
                                            </span>
                                            {solicitud.estado === 'ACEPTADA' && (
                                                <button onClick={() => cancelarTutoria(solicitud.id)} style={{ padding: '6px 12px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                                    🗑️ Revocar Tutor
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {pacienteAAdministrar && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '850px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative' }}>

                        <button onClick={cerrarAdministracion} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ❌ Cerrar Panel
                        </button>

                        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '22px' }}>Panel de Administración del Tutor</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <form onSubmit={guardarCambiosPaciente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h3 style={{ margin: 0, color: '#34495e', fontSize: '16px' }}>⚙️ Administrar Paciente</h3>
                                <p style={{ margin: 0, fontSize: '12px', color: '#7f8c8d' }}>Modificando los datos de: {formEmail}</p>

                                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Correo Electrónico:</label>
                                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required style={inputStyle} />

                                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Nombre completo:</label>
                                <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} required style={inputStyle} />

                                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Edad:</label>
                                <input type="number" value={formEdad} onChange={(e) => setFormEdad(e.target.value)} required style={inputStyle} min="1" max="120" />

                                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Contraseña (Opcional):</label>
                                <input type="password" placeholder="Dejar en blanco para no cambiar" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} style={inputStyle} />

                                <button type="submit" style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                                    Guardar Cambios
                                </button>
                            </form>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '1px solid #eee', paddingLeft: '25px', alignItems: 'center' }}>
                                {/* 3️⃣ Aquí incrustamos directamente tu componente Waitlist */}
                                <div style={{ width: '100%' }}>
                                    <Waitlist emailPaciente={formEmail} />
                                </div>

                                <button
                                    onClick={() => cancelarTutoria(pacienteAAdministrar.id)}
                                    style={{ padding: '12px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%', maxWidth: '400px', marginTop: 'auto' }}
                                    title="Desvincular a este paciente"
                                >
                                    {pacienteAAdministrar.estado === 'ACEPTADA' ? '🔗 Desvincular Paciente' : '🗑️ Cancelar Tutoría'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

export default SolicitudesPaciente;