import React, { useEffect, useState } from 'react';
import { uploadProfilePicture } from '../scripts/img';


function Perfil() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Obtiene el nombre de usuario del localStorage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'Usuario');
  }, []);

  // Maneja la conversión de la imagen a Base64 y la previsualización
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Guarda la imagen en Base64
        setPreviewImage(reader.result); // Actualiza la previsualización
      };
      reader.readAsDataURL(file);
    }
  };

  // Maneja la subida de la imagen llamando a img.js
  const handleImageUpload = async () => {
    if (!profileImage) return alert("Selecciona una imagen primero");

    try {
      const message = await uploadProfilePicture(1, profileImage); // Cambia '1' por el ID real del usuario
      alert(message); // Muestra el mensaje de éxito
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100vh' }}>
      {/* Sección 1: Contenedor para foto de perfil y nombre de usuario */}
      <div style={{ backgroundColor: '#D26485', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewImage ? (
            <img src={previewImage} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>Sin foto</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '20px', padding: '10px', cursor: 'pointer' }} />
        <button onClick={handleImageUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>Subir Foto</button>
        <div style={{ fontSize: '1.5em', color: '#fff', fontWeight: 'bold', marginTop: '10px' }}>{username}</div>
      </div>

      {/* Sección Unificada (2, 3 y 4) */}
      <div style={{ backgroundColor: '#C69EE7', gridColumn: '2 / 5', padding: '20px' }}>Sección Unificada (2, 3 y 4)</div>

      {/* Resto de las secciones */}
      <div style={{ backgroundColor: '#E96565', padding: '20px' }}>Sección 5</div>
      <div style={{ backgroundColor: '#8BC34A', padding: '20px' }}>Sección 6</div>
      <div style={{ backgroundColor: '#FF9800', padding: '20px' }}>Sección 7</div>
      <div style={{ backgroundColor: '#E6E6E6', padding: '20px' }}>Sección 8</div>
    </div>
  );
}

export default Perfil;
