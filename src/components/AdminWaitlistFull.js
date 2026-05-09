import React, { useState, useEffect } from 'react';

const AdminWaitlistFull = ({ trigger }) => {
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = () => {
        setCargando(true);
        const token = localStorage.getItem('token'); 
        fetch('http://localhost:8082/api/waitlist/todas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }) 
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setLista(data);
            setCargando(false);
        })
        .catch(err => {
            console.error("Error cargando lista:", err);
            setCargando(false);
        });
    };

    useEffect(() => {
        cargarDatos();
    }, [trigger]);

    const grupos = lista.reduce((acc, item) => {
        const esp = item.especialidad || "SIN ESPECIALIDAD";
        if (!acc[esp]) acc[esp] = [];
        acc[esp].push(item);
        return acc;
    }, {});

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Monitor de Listas de Espera</h2>
            
            {cargando ? <p>Sincronizando datos...</p> : (
                Object.keys(grupos).length === 0 ? <p>No hay pacientes en ninguna lista.</p> : (
                    Object.keys(grupos).map(especialidad => (
                        <div key={especialidad} style={{ marginBottom: '30px', backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#2980b9', marginTop: 0, textTransform: 'capitalize' }}>
                                🏥 {especialidad.replace('_', ' ')}
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email Paciente</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupos[especialidad].map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{item.email}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.85em',
                                                    backgroundColor: item.estado === 'PENDIENTE' ? '#fef9e7' : '#eafaf1',
                                                    color: item.estado === 'PENDIENTE' ? '#f39c12' : '#27ae60',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {item.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default AdminWaitlistFull;