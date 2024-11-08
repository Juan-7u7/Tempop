import * as React from 'react';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios'; // Asegúrate de instalar axios con `npm install axios`
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

function FormularioRegistro() {
  const [formData, setFormData] = React.useState({
    usuario: '',
    nombre: '',
    correo: '',
    tipo: '',
    contraseña: ''
  });
  const [registroExitoso, setRegistroExitoso] = React.useState(false); // Nuevo estado
  const navigate = useNavigate(); // Hook de navegación

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/registro', formData);
      alert(response.data);
      setRegistroExitoso(true); // Muestra el botón "Siguiente" después de un registro exitoso

      // Guarda los datos del usuario en localStorage
      localStorage.setItem('username', formData.usuario);
      localStorage.setItem('nombre', formData.nombre);

    } catch (error) {
      console.error('Error al registrar el usuario:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data.error) {
        alert(`Hubo un error al registrar el usuario: ${error.response.data.error}`);
      } else {
        alert('Hubo un error al registrar el usuario. Verifique la consola para más detalles.');
      }
      setRegistroExitoso(false); // Oculta el botón en caso de error
    }
  };

  const handleNext = () => {
    navigate('/inicio'); // Redirige a la página "inicio"
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: { xs: '90%', sm: '80%', md: '40%' },
        margin: 'auto',
        mt: 4,
        p: { xs: 2, sm: 3 },
        boxShadow: { xs: 1, md: 3 },
        borderRadius: 2,
        backgroundColor: 'white'
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
        Registro de Usuario
      </Typography>
      <TextField
        label="Usuario"
        variant="outlined"
        name="usuario"
        value={formData.usuario}
        onChange={handleChange}
        required
      />
      <TextField
        label="Nombre"
        variant="outlined"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <TextField
        label="Correo"
        variant="outlined"
        name="correo"
        type="email"
        value={formData.correo}
        onChange={handleChange}
        required
      />
      <FormControl variant="outlined" required>
        <InputLabel id="tipo-label">Tipo</InputLabel>
        <Select
          labelId="tipo-label"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          label="Tipo"
        >
          <MenuItem value="Candidato">Candidato</MenuItem>
          <MenuItem value="Reclutador">Reclutador</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Contraseña"
        variant="outlined"
        name="contraseña"
        type="password"
        value={formData.contraseña}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Registrar
      </Button>
      {registroExitoso && ( // Mostrar el botón "Siguiente" solo si el registro fue exitoso
        <Button variant="outlined" color="success" sx={{ mt: 2 }} onClick={handleNext}>
          Siguiente
        </Button>
      )}
    </Box>
  );
}

export default FormularioRegistro;
