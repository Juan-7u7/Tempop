import React from 'react';
import '../App.css'; // Ajusta la ruta si es necesario
import FormularioInicioSesion from '../components/form_login'; // Importa el componente con la ruta correcta

function Registro() {
  return (
    <div>
      <h1>Página de Registro</h1>
      <FormularioInicioSesion/> {/* Agrega el componente de formulario */}
    </div>
  );
}

export default Registro;
