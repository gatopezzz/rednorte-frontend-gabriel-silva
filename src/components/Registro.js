import React, { useState } from 'react';

const Registro = ({ irALogin }) => {
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const manejarCambioRut = (e) => {
        let valor = e.target.value;
        let rutLimpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
        
        if (rutLimpio.length === 0) {
            setRut('');
            return;
        }

        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1);

        if (cuerpo.length > 0) {
            cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setRut(`${cuerpo}-${dv}`);
        } else {
            setRut(dv);
        }
    };

    const validarFormulario = () => {
        setError(''); 

        if (nombre.trim().length < 3) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        
        const rutSinFormato = rut.replace(/[^0-9kK]/g, '');
        if (rutSinFormato.length < 8) {
            return "El RUT ingresado es demasiado corto.";
        }

        if (email.trim().length < 12 || !email.includes('@')) {
            return "El correo debe tener al menos 12 caracteres y ser válido.";
        }

        const passwordValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordValida.test(password)) {
            return "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
        }

        return null; 
    };

    const handleRegistro = async () => {
        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        try {
            const rutParaBD = rut.replace(/[^0-9kK]/g, '');

            const response = await fetch('http://localhost:8082/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, rut: rutParaBD, email, password })
            });

            if (response.ok) {
                setMensaje('✅ Cuenta creada exitosamente. Redirigiendo al inicio de sesión...');
                setError('');
                
                setTimeout(() => { 
                    irALogin(); 
                }, 1500);

            } else {
                setError('Error al registrar. El correo o RUT ya podrían estar en uso.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
            <h2>Crear Cuenta - RedNorte</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    style={{ padding: '10px', width: '90%', marginBottom: '10px' }}
                />
                <input 
                    type="text" 
                    placeholder="RUT (ej: 123456789)" 
                    value={rut} 
                    onChange={manejarCambioRut} 
                    maxLength={12} 
                    style={{ padding: '10px', width: '90%', marginBottom: '10px' }}
                />
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ padding: '10px', width: '90%', marginBottom: '10px' }}
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ padding: '10px', width: '90%' }}
                />
                <small style={{ display: 'block', textAlign: 'left', marginLeft: '5%', color: '#7f8c8d', marginTop: '5px' }}>
                    * Mínimo 8 caracteres (letras y números)
                </small>
            </div>

            <button 
                onClick={handleRegistro}
                style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '95%', fontWeight: 'bold' }}
            >
                Registrarse
            </button>

            {error && <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '15px' }}>❌ {error}</p>}
            {mensaje && <p style={{ color: '#27ae60', fontWeight: 'bold', marginTop: '15px' }}>{mensaje}</p>}

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button 
                    onClick={irALogin}
                    style={{ padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                    Volver a Inicio de Sesión
                </button>
            </div>
        </div>
    );
};

export default Registro;