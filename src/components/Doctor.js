import React, { useState, useEffect, useCallback } from 'react';

const Doctor = () => {
    const [pacientes, setPacientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    const especialidad = localStorage.getItem('especialidad');
    const token = localStorage.getItem('token'); 

    const cargarPacientes = useCallback(() => {
        setCargando(true);
        if (!especialidad || especialidad === 'NINGUNA') {
            setCargando(false);
            return;
        }

        fetch(`http://localhost:8082/api/waitlist/especialidad/${especialidad}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setPacientes(data);
            }
            setCargando(false);
        })
        .catch(err => {
            console.error("Error al cargar pacientes:", err);
            setCargando(false);
        });
    }, [especialidad, token]);

    useEffect(() => {
        cargarPacientes();
    }, [cargarPacientes]);

    const atenderPaciente = async (id) => {
        try {
            const response = await fetch(`http://localhost:8082/api/waitlist/${id}/atender`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                cargarPacientes();
            } else {
                console.error("Error al marcar como atendido");
                alert("No se pudo actualizar el estado del paciente.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    if (!especialidad || especialidad === 'NINGUNA') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>No tienes una especialidad asignada.</h2>
                <p>Contacta al administrador para que te asigne a un área médica.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ backgroundColor: '#2c3e50', padding: '20px', borderRadius: '10px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Panel Médico</h2>
                    <p style={{ margin: '5px 0 0 0' }}>Especialidad: <strong>{especialidad.replace('_', ' ')}</strong></p>
                </div>
                <button 
                    onClick={cargarPacientes}
                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🔄 Actualizar Pacientes
                </button>
            </div>

            <h3>Pacientes en Espera ({pacientes.length})</h3>

            {cargando ? (
                <p>Cargando lista de pacientes...</p>
            ) : pacientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #ccc' }}>
                    <p style={{ color: '#7f8c8d', fontSize: '1.1em', fontWeight: 'bold' }}>No hay pacientes pendientes en este momento.</p>
                    <p style={{ color: '#95a5a6' }}>Puedes tomarte un café ☕</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pacientes.map((p) => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #f39c12' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{p.email}</h4>
                                <span style={{ color: '#f39c12', fontSize: '0.85em', fontWeight: 'bold' }}>{p.estado}</span>
                            </div>
                            <button 
                                onClick={() => atenderPaciente(p.id)}
                                style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Llamar y Atender
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctor;