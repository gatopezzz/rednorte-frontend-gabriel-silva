import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Waitlist from './components/Waitlist';
import AdminUsers from './components/AdminUsers';
import AdminWaitlistFull from './components/AdminWaitlistFull';
import Doctor from './components/Doctor';
import Perfil from './components/Perfil';

function App() {
  const [vistaActual, setVistaActual] = useState('home');
  const [vistaPrevia, setVistaPrevia] = useState('home'); 
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [rolActual, setRolActual] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0); 

  const manejarLoginExitoso = (email, rol, especialidad) => {
    setUsuarioActual(email);
    setRolActual(rol);

    if (rol === 'ADMIN') {
        setVistaActual('admin');
    } else if (rol === 'DOCTOR') {
        setVistaActual('doctor');
    } else {
        setVistaActual('panel');
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setUsuarioActual(null);
    setRolActual(null);
    setVistaActual('home');
  };

  const irAInicioSegunRol = () => {
    if (!usuarioActual) setVistaActual('home');
    else if (rolActual === 'ADMIN') setVistaActual('admin');
    else if (rolActual === 'DOCTOR') setVistaActual('doctor');
    else setVistaActual('panel');
  };

  const abrirPerfil = () => {
    setVistaPrevia(vistaActual);
    setVistaActual('perfil');
  };

  const sincronizarMiCuenta = async () => {
    if (!usuarioActual) return;
    try {
      const token = localStorage.getItem('token'); // 1. Sacamos la llave de la memoria
      
      // 2. Se la enviamos al backend en los Headers
      const res = await fetch(`http://localhost:8082/api/auth/me/${usuarioActual}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('especialidad', data.especialidad);
        setRolActual(data.rol);
        
        if (data.rol === 'ADMIN') setVistaActual('admin');
        else if (data.rol === 'DOCTOR') setVistaActual('doctor');
        else setVistaActual('panel');
        
        setRecargarDatos(prev => prev + 1);
        
      } else {
        console.error("El servidor rechazó la sincronización. Código:", res.status);
      }
    } catch (error) {
      console.error("Error de red al sincronizar cuenta:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <nav style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={irAInicioSegunRol}>
          RedNorte 🏥
        </h2>
        <div>
          {usuarioActual ? (
            <>
              <span style={{ marginRight: '15px', fontSize: '0.9em' }}>
                <strong>{rolActual}:</strong> {usuarioActual}
              </span>
              <button onClick={sincronizarMiCuenta} style={{...btnNavStyle, backgroundColor: '#34495e', borderColor: '#34495e'}}>
                🔄 Sincronizar
              </button>
              <button onClick={abrirPerfil} style={btnNavStyle}>👤 Mi Perfil</button>
              <button onClick={cerrarSesion} style={btnNavStyle}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => setVistaActual('login')} style={btnNavStyle}>Iniciar Sesión</button>
              <button onClick={() => setVistaActual('registro')} style={btnNavStyle}>Crear Cuenta</button>
            </>
          )}
        </div>
      </nav>

      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        {vistaActual === 'home' && !usuarioActual && (
          <div style={{ textAlign: 'center', marginTop: '80px', maxWidth: '600px' }}>
            <h1>Bienvenido a RedNorte</h1>
            <p style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Gestión profesional de pacientes y listas de espera por especialidad.</p>
            <button onClick={() => setVistaActual('registro')} style={btnActionStyle}>Comenzar ahora</button>
          </div>
        )}

        {vistaActual === 'login' && !usuarioActual && (
          <Login onLoginExitoso={manejarLoginExitoso} irARegistro={() => setVistaActual('registro')} />
        )}
        
        {vistaActual === 'registro' && !usuarioActual && (
          <Registro irALogin={() => setVistaActual('login')} />
        )}

        {vistaActual === 'panel' && usuarioActual && (
          <Waitlist userEmail={usuarioActual} />
        )}

        {vistaActual === 'doctor' && usuarioActual && (
          <Doctor key={recargarDatos} /> 
        )}

        {vistaActual === 'perfil' && usuarioActual && (
          <Perfil 
            userEmail={usuarioActual} 
            alActualizar={() => setVistaActual(vistaPrevia)} 
          />
        )}

        {vistaActual === 'admin' && usuarioActual && (
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Panel de Administración General</h2>
            
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <button 
                onClick={() => setRecargarDatos(prev => prev + 1)}
                style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🔄 Actualizar Tablas
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <AdminUsers trigger={recargarDatos} />
              <AdminWaitlistFull trigger={recargarDatos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const btnNavStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' };
const btnActionStyle = { backgroundColor: '#27ae60', color: 'white', padding: '15px 35px', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' };

export default App;