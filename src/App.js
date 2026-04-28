import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Waitlist from './components/Waitlist';
import AdminUsers from './components/AdminUsers';
import AdminWaitlistFull from './components/AdminWaitlistFull';

function App() {
  const [vistaActual, setVistaActual] = useState('home');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0); 

  const manejarLoginExitoso = (email, rol) => {
    setUsuarioActual(email);
    if (rol === 'ADMIN') {
      setVistaActual('admin');
    } else {
      setVistaActual('panel');
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    setVistaActual('home');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setVistaActual(usuarioActual ? (usuarioActual === 'admin@gmail.com' ? 'admin' : 'panel') : 'home')}>
          RedNorte
        </h2>
        <div>
          {usuarioActual ? (
            <>
              <span style={{ marginRight: '15px' }}>Sesión: {usuarioActual}</span>
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
          <div style={{ textAlign: 'center', marginTop: '50px', maxWidth: '600px' }}>
            <h1>Bienvenido a RedNorte</h1>
            <p>Gestión profesional de pacientes y listas de espera.</p>
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

        {vistaActual === 'admin' && usuarioActual && (
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>Panel de Administración - RedNorte</h2>
            
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <button 
                onClick={() => setRecargarDatos(prev => prev + 1)}
                style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🔄 Actualizar Listas
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
const btnActionStyle = { backgroundColor: '#27ae60', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' };

export default App;