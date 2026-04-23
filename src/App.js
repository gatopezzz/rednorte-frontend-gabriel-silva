import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Arial' }}>
      {mostrarLogin ? <Login /> : <Registro />}
      
      <button 
        onClick={() => setMostrarLogin(!mostrarLogin)}
        style={{ marginTop: '20px', padding: '10px', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid #ccc' }}
      >
        {mostrarLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}

export default App;