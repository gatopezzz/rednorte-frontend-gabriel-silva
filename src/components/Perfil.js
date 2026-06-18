import React, { useState, useEffect, useCallback } from 'react';

// 👇 Propiedad opcional para la administración delegada
const Perfil = ({ userEmail, alActualizar, emailPaciente }) => {
    
    // El correo real de la fila que queremos modificar en la BD
    const correoAEditar = emailPaciente || userEmail;

    const [email, setEmail] = useState(correoAEditar || '');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    // 👇 Corrección y protección contra pantallas en blanco
    const cargarDatosDelPerfil = useCallback(async () => {
        if (!correoAEditar) return;
        try {
            // Se cambia /usuarios/ por /users/ para coincidir con tus controladores de Spring
            const response = await fetch(`http://localhost:8082/api/auth/users/email/${correoAEditar}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setEmail(data.email || correoAEditar);
                    setNombre(data.nombre || '');
                    setEdad(data.edad ? String(data.edad) : '');
                }
            } else {
                console.warn("El backend no encontró el usuario o la ruta no es válida. Usando datos locales temporales.");
                setEmail(correoAEditar);
            }
        } catch (err) {
            console.error("Error al obtener datos del perfil (Evitando pantalla en blanco):", err);
            setEmail(correoAEditar); // Mantiene el email en los inputs para evitar que colapse la vista
        }
    }, [correoAEditar]);

    useEffect(() => {
        cargarDatosDelPerfil();
    }, [cargarDatosDelPerfil]);

    const validarDatos = () => {
        if (!email || email.trim().length < 5 || !email.includes('@')) {
            return "Por favor introduce un correo electrónico válido.";
        }
        if (nombre && nombre.trim().length < 3) return "El nombre es demasiado corto.";
        
        const passwordValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (password && !passwordValida.test(password)) {
            return "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
        }
        return null;
    };

    const handleUpdate = async () => {
        const err = validarDatos();
        if (err) { setError(err); return; }

        try {
            // Aseguramos que apunte a la misma ruta que usas en el administrador
            const response = await fetch('http://localhost:8082/api/auth/users/update-admin', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalEmail: correoAEditar, 
                    email: email, 
                    nombre: nombre,
                    edad: edad ? parseInt(edad, 10) : null, 
                    password: password ? password : null,
                    rol: 'PACIENTE'
                })
            });

            if (response.ok) {
                setMensaje(emailPaciente 
                    ? '✅ ¡Perfil del paciente actualizado correctamente!' 
                    : '✅ Perfil actualizado con éxito.'
                );
                setError('');
                setTimeout(() => {
                    if (alActualizar) alActualizar();
                }, 2000);
            } else {
                const text = await response.text();
                setError(text || 'No se pudo actualizar el perfil.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            
            <h2 style={{ textAlign: 'center', color: '#2c3e50', margin: '0 0 5px 0' }}>
                {emailPaciente ? "⚙️ Administrar Paciente" : "Mi Perfil"}
            </h2>
            <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '0.9em', marginBottom: '20px' }}>
                {emailPaciente ? `Modificando los datos de: ${correoAEditar}` : "Gestiona tu información personal"}
            </p>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Correo Electrónico:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={inputStyle} 
                />
                
                <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Nombre completo:</label>
                <input 
                    type="text" 
                    placeholder="Escribe el nombre" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    style={inputStyle} 
                />

                <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Edad:</label>
                <input 
                    type="text" 
                    placeholder="Escribe la edad" 
                    value={edad} 
                    onChange={(e) => setEdad(e.target.value)} 
                    style={inputStyle} 
                />

                <label style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Contraseña {emailPaciente && "(Opcional para el paciente)"}:</label>
                <input 
                    type="password" 
                    placeholder="Dejar en blanco para no cambiar" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={inputStyle} 
                />
            </div>

            <button onClick={handleUpdate} style={btnStyle}>Guardar Cambios</button>
            
            {alActualizar && (
                <button onClick={alActualizar} style={btnVolverStyle}>Cancelar / Volver</button>
            )}

            {error && <p style={{ color: '#e74c3c', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>❌ {error}</p>}
            {mensaje && <p style={{ color: '#27ae60', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{mensaje}</p>}
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const btnVolverStyle = { ...btnStyle, backgroundColor: 'transparent', color: '#7f8c8d', border: '1px solid #ddd', marginTop: '10px' };

export default Perfil;