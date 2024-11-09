import * as React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FormularioInicioSesion() {
  const [formData, setFormData] = React.useState({
    usuario: '',
    contraseña: ''
  });

  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:3001/login', formData);
      if (response.data.success) {
        alert('Inicio de sesión exitoso');
  
        // Guarda el nombre de usuario y el userId en localStorage
        localStorage.setItem('username', formData.usuario);
        localStorage.setItem('userId', response.data.user.id); // Almacena el ID del usuario en localStorage
  
        navigate('/inicio'); // Redirige a la página "inicio"
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
      setError('Hubo un error al iniciar sesión. Verifique la consola para más detalles.');
    }
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
        Inicio de Sesión
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
        label="Contraseña"
        variant="outlined"
        name="contraseña"
        type="password"
        value={formData.contraseña}
        onChange={handleChange}
        required
      />
      {error && <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Iniciar Sesión
      </Button>
    </Box>
  );
}

export default FormularioInicioSesion;
