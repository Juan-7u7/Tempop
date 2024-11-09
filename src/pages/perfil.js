import React, { useEffect, useState } from 'react';
import { uploadProfilePicture, getUserIdByUsername, getProfilePicture } from '../scripts/img';
import TextField from '@mui/material/TextField';

function Perfil() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'Usuario');

    if (storedUsername) {
      const fetchUserId = async () => {
        try {
          const id = await getUserIdByUsername(storedUsername);
          setUserId(id);
        } catch (error) {
          console.error('Error al obtener el ID del usuario:', error);
        }
      };
      fetchUserId();
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchProfilePicture = async () => {
        try {
          const imageUrl = await getProfilePicture(userId);
          setPreviewImage(imageUrl);
        } catch (error) {
          console.error('Error al obtener la foto de perfil:', error);
          setPreviewImage(null); // Establecer imagen por defecto
        }
      };
      fetchProfilePicture();
  
      // Limpieza de URLs de blob
      return () => {
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
      };
    }
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return alert("Selecciona una imagen primero");
    if (!userId) return alert("Error: No se pudo obtener el ID del usuario");

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('profilePicture', profileImage);

      const message = await uploadProfilePicture(formData);
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100vh' }}>
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewImage ? (
            <img src={previewImage} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>Sin foto</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '20px', padding: '10px', cursor: 'pointer' }} />
        <button onClick={handleImageUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>Guardar Perfil</button>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold', marginTop: '10px' }}>{username}</div>
      </div>

      {/* Sección Unificada (2, 3 y 4) con título y TextField */}
      <div style={{ gridColumn: '2 / 5', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Descripción</h2>
        <TextField
          id="outlined-basic"
          label="Descripción"
          variant="outlined"
          fullWidth
          multiline
          rows={8} // Puedes ajustar el valor de rows para ocupar el espacio vertical
        />
      </div>

      {/* Sección Habilidades con título y 5 TextFields */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Habilidades</h2>
        <TextField label="Habilidad 1" variant="outlined" fullWidth />
        <TextField label="Habilidad 2" variant="outlined" fullWidth />
        <TextField label="Habilidad 3" variant="outlined" fullWidth />
        <TextField label="Habilidad 4" variant="outlined" fullWidth />
        <TextField label="Habilidad 5" variant="outlined" fullWidth />
      </div>

      {/* Sección Experiencia con título y 4 TextFields */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Experiencia</h2>
        <TextField label="Experiencia 1" variant="outlined" fullWidth />
        <TextField label="Experiencia 2" variant="outlined" fullWidth />
        <TextField label="Experiencia 3" variant="outlined" fullWidth />
        <TextField label="Experiencia 4" variant="outlined" fullWidth />
      </div>

      {/* Sección Contacto con título y 3 TextFields */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>Contacto</h2>
        <TextField label="Contacto 1" variant="outlined" fullWidth />
        <TextField label="Contacto 2" variant="outlined" fullWidth />
        <TextField label="Contacto 3" variant="outlined" fullWidth />
      </div>

      {/* Sección Calificación con título */}
      <div style={{ padding: '20px' }}>
        <h2>Calificación</h2>
      </div>
    </div>
  );
}

export default Perfil;
