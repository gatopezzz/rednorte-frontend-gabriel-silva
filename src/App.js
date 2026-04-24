import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Waitlist from './components/Waitlist';

function App() {
  // Estados para controlar qué pantalla se ve y quién está conectado
  const [vistaActual, setVistaActual] = useState('home'); // Vistas: 'home', 'login', 'registro', 'panel'
  const [usuarioActual, setUsuarioActual] = useState(null); // Guarda el email si hay sesión iniciada

  // Función mágica que llamaremos cuando el login sea correcto
  const manejarLoginExitoso = (email) => {
    setUsuarioActual(email);
    setVistaActual('panel'); // Enviamos al usuario directo a la Lista de Espera
  };

  // Función para cerrar sesión y volver al inicio
  const cerrarSesion = () => {
    setUsuarioActual(null);
    setVistaActual('home');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* --- BARRA DE NAVEGACIÓN SUPERIOR --- */}
      <nav style={{ padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setVistaActual(usuarioActual ? 'panel' : 'home')}>
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

      {/* --- CONTENEDOR DE PANTALLAS DINÁMICAS --- */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        
        {/* 1. HOME PÚBLICO (Solo se ve si no hay sesión y estamos en vista 'home') */}
        {vistaActual === 'home' && !usuarioActual && (
          <div style={{ textAlign: 'center', marginTop: '50px', maxWidth: '600px' }}>
            <h1 style={{ color: '#2c3e50' }}>Bienvenido al Instituto RedNorte</h1>
            <p style={{ fontSize: '18px', color: '#555' }}>
              Plataforma oficial para la gestión de clases y control de asistencia. 
              Inicia sesión para acceder a tus asignaturas y unirte a la lista de espera.
            </p>
            <div style={{ marginTop: '40px' }}>
              <button onClick={() => setVistaActual('registro')} style={btnActionStyle}>Comenzar ahora</button>
            </div>
          </div>
        )}

        {/* 2. PANTALLA DE LOGIN */}
        {vistaActual === 'login' && !usuarioActual && (
           // Le pasamos la función al Login para que nos avise cuando tenga éxito
          <Login onLoginExitoso={manejarLoginExitoso} irARegistro={() => setVistaActual('registro')} />
        )}

        {/* 3. PANTALLA DE REGISTRO */}
        {vistaActual === 'registro' && !usuarioActual && (
          <Registro irALogin={() => setVistaActual('login')} />
        )}

        {/* 4. PANEL DE ALUMNO (Segundo Microservicio) */}
        {vistaActual === 'panel' && usuarioActual && (
          <Waitlist userEmail={usuarioActual} />
        )}

      </div>
    </div>
  );
}

// Estilos rápidos para los botones (para que se vea presentable en tu video)
const btnNavStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' };
const btnActionStyle = { backgroundColor: '#27ae60', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' };

export default App;