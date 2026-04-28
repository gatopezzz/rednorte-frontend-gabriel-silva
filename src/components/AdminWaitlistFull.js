import React, { useState, useEffect } from 'react';

const AdminWaitlistFull = ({ trigger }) => {
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        setCargando(true);
        
        fetch('http://localhost:8083/api/waitlist') 
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLista(data);
                else setLista([]);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando lista:", err);
                setLista([]);
                setCargando(false);
            });
    }, [trigger]);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Pacientes en Espera</h3>
            {cargando ? <p>Actualizando...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>Email Paciente</th>
                            <th style={{ padding: '8px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.length === 0 ? (
                            <tr><td colSpan="2" style={{ textAlign: 'center', padding: '10px' }}>Lista vacía</td></tr>
                        ) : (
                            lista.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.email}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#f39c12', fontWeight: 'bold' }}>
                                        {item.estado}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminWaitlistFull;