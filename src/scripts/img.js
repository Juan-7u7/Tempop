import axios from 'axios';

export const getUserIdByUsername = async (username) => {
  try {
    const response = await axios.get(`http://localhost:3001/get-user-id`, {
      params: { username },
    });
    return response.data.userId;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el ID del usuario');
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    const response = await axios.post('http://localhost:3001/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.message;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al subir la foto de perfil');
  }
};

// Nueva función para obtener la imagen de perfil
// En tu script de img.js, modifica la función getProfilePicture así:
export const getProfilePicture = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/get-profile-picture?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Convertir la respuesta a blob
    const blob = await response.blob();
    // Crear URL del blob
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error('Error en getProfilePicture:', error);
    throw new Error('Error al obtener la foto de perfil');
  }
};
