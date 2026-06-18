import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Waitlist from './components/Waitlist';
import AdminUsers from './components/AdminUsers';
import AdminWaitlistFull from './components/AdminWaitlistFull';
import Doctor from './components/Doctor';
import EnviarSolicitud from './components/EnviarSolicitud';
import SolicitudesPaciente from './components/SolicitudesPaciente';
import Perfil from './components/Perfil'; // 👈 1. IMPORTACIÓN CORREGIDA AQUÍ

function App() {
  const [vistaActual, setVistaActual] = useState('home');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [rolActual, setRolActual] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0);

  const manejarLoginExitoso = (email, rol, especialidad, id) => {
    setUsuarioActual(email);
    setRolActual(rol);
    setUsuarioId(id);
    localStorage.setItem('usuarioId', id);
    localStorage.setItem('rol', rol); 

    if (rol === 'ADMIN') setVistaActual('admin');
    else if (rol === 'DOCTOR') setVistaActual('doctor');
    else setVistaActual('panel');
  };

  const cerrarSesion = () => {
    localStorage.clear();
    setUsuarioActual(null);
    setRolActual(null);
    setUsuarioId(null);
    setVistaActual('home');
  };

  const irAInicioSegunRol = () => {
    if (!usuarioActual) setVistaActual('home');
    else if (rolActual === 'ADMIN') setVistaActual('admin');
    else if (rolActual === 'DOCTOR') setVistaActual('doctor');
    else setVistaActual('panel');
  };

  const abrirPerfil = () => {
    setVistaActual('perfil');
  };

  const sincronizarMiCuenta = async () => {
    if (!usuarioActual) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8082/api/auth/me/${usuarioActual}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setRolActual(data.rol);
        localStorage.setItem('rol', data.rol);
        setRecargarDatos(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error al sincronizar:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <nav style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={irAInicioSegunRol}>RedNorte 🏥</h2>
        <div>
          {usuarioActual ? (
            <>
              <span style={{ marginRight: '15px' }}><strong>{rolActual}:</strong> {usuarioActual}</span>
              <button onClick={sincronizarMiCuenta} style={btnNavStyle}>🔄 Sincronizar</button>
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
        {/* LÓGICA DE PANEL PRINCIPAL */}
        {vistaActual === 'panel' && usuarioActual && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '900px' }}>
            <Waitlist userEmail={usuarioActual} />
            <div style={{ borderTop: '2px solid #ecf0f1', paddingTop: '20px' }}>
              <SolicitudesPaciente miUsuarioId={usuarioId} trigger={recargarDatos} />
            </div>
            <div style={{
              border: '2px solid #27ae60',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#eafaf1'
            }}>
              <h3 style={{ color: '#27ae60', marginTop: 0 }}>Panel de Tutoría (Gestionar Alumnos)</h3>
              <EnviarSolicitud miUsuarioId={usuarioId} trigger={recargarDatos} />
            </div>
          </div>
        )}

        {/* 2. RENDERIZADO DE LA VISTA PERFIL CORREGIDO AQUÍ */}
        {vistaActual === 'perfil' && usuarioActual && (
          <Perfil 
            userEmail={usuarioActual} 
            alActualizar={irAInicioSegunRol} 
          />
        )}

        {vistaActual === 'home' && !usuarioActual && (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <h1>Bienvenido a RedNorte</h1>
            <button onClick={() => setVistaActual('registro')} style={btnActionStyle}>Comenzar ahora</button>
          </div>
        )}
        {vistaActual === 'login' && <Login onLoginExitoso={manejarLoginExitoso} />}
        {vistaActual === 'registro' && <Registro />}
        {vistaActual === 'doctor' && <Doctor key={recargarDatos} />}
        {vistaActual === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
            <AdminUsers trigger={recargarDatos} />
            <AdminWaitlistFull trigger={recargarDatos} />
          </div>
        )}
      </div>
    </div>
  );
}

const btnNavStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' };
const btnActionStyle = { backgroundColor: '#27ae60', color: 'white', padding: '15px 35px', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' };

export default App;