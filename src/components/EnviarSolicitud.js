import React, { useState, useEffect, useCallback } from 'react';
import tutoria from './Turoria'; 

// 👇 Importamos tus dos componentes inteligentes
import Perfil from './Perfil'; 
import Waitlist from './Waitlist';

const EnviarSolicitud = ({ miUsuarioId, trigger }) => {
    const [datoDestino, setDatoDestino] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [misSolicitudes, setMisSolicitudes] = useState([]);
    const [usuariosSistema, setUsuariosSistema] = useState([]); // Guarda correos y nombres del sistema
    
    // 👇 ESTADO: Controla el correo del paciente que estamos administrando
    const [correoPacienteAAdministrar, setCorreoPacienteAAdministrar] = useState(null);

    const cargarMisSolicitudes = useCallback(async () => {
        if (!miUsuarioId) return;
        try {
            const res = await tutoria.obtenerEnviadas(miUsuarioId);
            setMisSolicitudes(res.data);
        } catch (error) {
            console.error("Error al cargar el historial:", error);
        }
    }, [miUsuarioId]);

    // 👇 Obtenemos todos los usuarios para traducir el ID de Antonela a su Correo Real
    const cargarUsuariosSistema = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8082/api/auth/users');
            if (response.ok) {
                const data = await response.json();
                setUsuariosSistema(data);
            }
        } catch (err) {
            console.error("Error al mapear usuarios:", err);
        }
    }, []);

    useEffect(() => {
        cargarMisSolicitudes();
        cargarUsuariosSistema();
    }, [cargarMisSolicitudes, cargarUsuariosSistema, trigger]);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setMensaje('');
        
        if (!datoDestino) {
            setMensaje('⚠️ Por favor ingresa el correo del adulto mayor.');
            return;
        }

        try {
            await tutoria.crearSolicitud(miUsuarioId, datoDestino);
            setMensaje('✅ Solicitud enviada exitosamente.');
            setDatoDestino('');
            cargarMisSolicitudes();
        } catch (error) {
            setMensaje('❌ Error: Asegúrate de que el correo exista y sea un paciente de tercera edad.');
        }
    };

    const administrarPaciente = (correoPaciente) => {
        setCorreoPacienteAAdministrar(correoPaciente);
    };

    const renderizarEstado = (estado, correoPaciente) => {
        if (estado === 'ACEPTADA') {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ Aceptada</span>
                    <button 
                        onClick={() => administrarPaciente(correoPaciente)}
                        style={{ padding: '6px 12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em', fontWeight: 'bold' }}
                    >
                        ⚙️ Administrar Perfil
                    </button>
                </div>
            );
        }
        if (estado === 'RECHAZADA') return <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>❌ Rechazada</span>;
        return <span style={{ color: '#f39c12', fontWeight: 'bold' }}>⏳ Pendiente</span>;
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', position: 'relative' }}>
            <h3>🤝 Ofrecer Tutoría</h3>
            <p style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
                Envía una solicitud por correo para convertirte en el tutor de un paciente.
            </p>
            
            <form onSubmit={manejarEnvio} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Correo del paciente" 
                    value={datoDestino}
                    onChange={(e) => setDatoDestino(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Enviar
                </button>
            </form>

            {mensaje && <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{mensaje}</p>}

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

            <h4>Mis Solicitudes Enviadas</h4>
            {misSolicitudes.length === 0 ? (
                <p style={{ color: '#7f8c8d', fontSize: '0.9em' }}>Aún no has enviado ninguna solicitud.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {misSolicitudes.map((solicitud) => {
                        // Buscamos al paciente en la lista de usuarios para obtener su correo
                        const datosPaciente = usuariosSistema.find(u => u.id === solicitud.idPacienteReceptor);
                        const correoReal = datosPaciente ? datosPaciente.email : null;
                        const nombreReal = datosPaciente ? datosPaciente.nombre : `ID: ${solicitud.idPacienteReceptor}`;

                        return (
                            <li key={solicitud.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span>Paciente: <strong>{nombreReal}</strong></span>
                                    {correoReal && <span style={{ display: 'block', fontSize: '0.8em', color: '#7f8c8d' }}>{correoReal}</span>}
                                </div>
                                <span>{renderizarEstado(solicitud.estado, correoReal)}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* 👇 EL CUADRO EMERGENTE (MODAL) CON LOS COMPONENTES INTEGRADOS */}
            {correoPacienteAAdministrar && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px',
                        width: '90%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Panel de Administración del Tutor</h2>
                            <button 
                                onClick={() => setCorreoPacienteAAdministrar(null)}
                                style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ✖ Cerrar Panel
                            </button>
                        </div>
                        
                        {/* 🔧 AQUÍ ESTÁN INTEGRADOS TUS COMPONENTES (Usamos flexbox para que queden uno al lado del otro en pantallas grandes) */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            <div style={{ flex: '1 1 400px' }}>
                                <Perfil 
                                    userEmail={""} 
                                    emailPaciente={correoPacienteAAdministrar} 
                                    alActualizar={() => { cargarMisSolicitudes(); }} // Solo refresca datos, no cierra el modal para seguir agendando
                                />
                            </div>
                            
                            <div style={{ flex: '1 1 400px' }}>
                                <Waitlist 
                                    emailPaciente={correoPacienteAAdministrar} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnviarSolicitud;