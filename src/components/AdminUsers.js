import React, { useState, useEffect } from 'react';

const AdminUsers = ({ trigger }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [listaEspecialidades, setListaEspecialidades] = useState([]); 
    const [editando, setEditando] = useState(null); 
    const [formEdit, setFormEdit] = useState({ email: '', nombre: '', rut: '', password: '', rol: 'PACIENTE', especialidad: 'NINGUNA', edad: '' });
    const [error, setError] = useState('');

    const cargarUsuarios = () => {
        fetch('http://localhost:8082/api/auth/users')
            .then(res => res.json())
            .then(data => setUsuarios(data));
    };

    const fetchEspecialidades = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/auth/especialidades');
            if (response.ok) {
                const data = await response.json();
                setListaEspecialidades(data);
            }
        } catch (error) {
            console.error("Error al cargar especialidades:", error);
        }
    };

    useEffect(() => { 
        cargarUsuarios(); 
        fetchEspecialidades();
    }, [trigger]);

    const iniciarEdicion = (u) => {
        setEditando(u.email);
        setFormEdit({ 
            email: u.email, 
            nombre: u.nombre || '', 
            rut: u.rut || '', 
            password: '',
            rol: u.rol,
            especialidad: u.especialidad || 'NINGUNA',
            edad: u.edad || ''
        });
        setError('');
    };

    const guardarEdicion = (originalEmail) => {
        const bodyData = {
            originalEmail,
            ...formEdit,
            edad: formEdit.edad ? parseInt(formEdit.edad, 10) : null
        };

        fetch('http://localhost:8082/api/auth/users/update-admin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }).then(async res => {
            if(res.ok) {
                setEditando(null);
                cargarUsuarios();
            } else {
                const text = await res.text();
                setError(text || 'Error al actualizar');
            }
        });
    };

    const eliminarUsuario = (email) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${email}? Esto borrará también sus registros en la lista de espera.`)) {
            fetch(`http://localhost:8082/api/auth/users/${email}`, {
                method: 'DELETE'
            }).then(() => cargarUsuarios());
        }
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>Gestión de Usuarios</h3>
            {error && <p style={{color: '#e74c3c', fontSize: '0.9em', fontWeight: 'bold'}}>❌ {error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                        <th style={{padding: '10px'}}>Info Personal</th>
                        <th style={{padding: '10px'}}>Rol y Especialidad</th>
                        <th style={{padding: '10px'}}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.email} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                {editando === u.email ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <input value={formEdit.rut} onChange={e => setFormEdit({...formEdit, rut: e.target.value})} placeholder="RUT" style={inputS} />
                                        <input value={formEdit.email} onChange={e => setFormEdit({...formEdit, email: e.target.value})} placeholder="Email" style={inputS} />
                                        <input value={formEdit.nombre} onChange={e => setFormEdit({...formEdit, nombre: e.target.value})} placeholder="Nombre" style={inputS} />
                                        <input value={formEdit.edad} type="number" onChange={e => setFormEdit({...formEdit, edad: e.target.value})} placeholder="Edad" style={inputS} min="1" max="120" />
                                        <input value={formEdit.password} type="password" onChange={e => setFormEdit({...formEdit, password: e.target.value})} placeholder="Nueva Clave (Opcional)" style={inputS} />
                                    </div>
                                ) : (
                                    <>
                                        <small style={{color: '#7f8c8d'}}>{u.rut || 'SIN RUT'}</small><br/>
                                        <strong>{u.email}</strong><br/>
                                        <span>{u.nombre} {u.edad ? `(${u.edad} años)` : ''}</span>
                                    </>
                                )}
                            </td>

                            <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                {editando === u.email ? (
                                    <>
                                        <select 
                                            value={formEdit.rol} 
                                            onChange={(e) => setFormEdit({...formEdit, rol: e.target.value})}
                                            style={{marginBottom: '5px', width: '100%', padding: '5px'}}
                                        >
                                            <option value="PACIENTE">PACIENTE</option>
                                            <option value="DOCTOR">DOCTOR</option>
                                        </select>
                                        <br/>
                                        {formEdit.rol === 'DOCTOR' && (
                                            <select 
                                                value={formEdit.especialidad} 
                                                onChange={(e) => setFormEdit({...formEdit, especialidad: e.target.value})}
                                                style={{width: '100%', padding: '5px'}}
                                            >
                                                {listaEspecialidades.map((esp) => (
                                                    <option key={esp} value={esp}>
                                                        {esp === 'NINGUNA' ? 'Sin Asignar' : esp.replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span style={{fontWeight: 'bold', color: u.rol === 'DOCTOR' ? '#2980b9' : '#27ae60'}}>{u.rol}</span>
                                        {u.rol === 'DOCTOR' && (
                                            <div>
                                                <small style={{color: '#7f8c8d'}}>
                                                    {u.especialidad === 'NINGUNA' ? 'Sin Asignar' : (u.especialidad || 'NINGUNA').replace(/_/g, ' ')}
                                                </small>
                                            </div>
                                        )}
                                    </>
                                )}
                            </td>

                            <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                {editando === u.email ? (
                                    <button onClick={() => guardarEdicion(u.email)} style={btnSaveStyle}>💾 Guardar</button>
                                ) : (
                                    <button onClick={() => iniciarEdicion(u)} style={btnEditStyle}>✏️ Editar</button>
                                )}
                                <button onClick={() => eliminarUsuario(u.email)} style={btnDeleteStyle}>🗑️ Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const inputS = { padding: '5px', borderRadius: '4px', border: '1px solid #ccc' };
const btnEditStyle = { backgroundColor: '#f1c40f', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 10px', marginRight: '5px', fontWeight: 'bold' };
const btnSaveStyle = { backgroundColor: '#2ecc71', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 10px', marginRight: '5px', color: 'white', fontWeight: 'bold' };
const btnDeleteStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 10px', fontWeight: 'bold' };

export default AdminUsers;