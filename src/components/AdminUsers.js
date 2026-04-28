import React, { useState, useEffect } from 'react';

const AdminUsers = ({ trigger }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        setCargando(true);
        fetch('/api/auth/users') 
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsuarios(data);
                else setUsuarios([]);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setUsuarios([]);
                setCargando(false);
            });
    }, [trigger]);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Usuarios del Sistema</h3>
            {cargando ? <p>Actualizando...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
                            <th style={{ padding: '8px' }}>RUT</th>
                            <th style={{ padding: '8px' }}>Email</th>
                            <th style={{ padding: '8px' }}>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>Sin datos</td></tr>
                        ) : (
                            usuarios.map((u, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{u.rut}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{u.email}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: u.rol === 'ADMIN' ? 'red' : 'black' }}>{u.rol}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;