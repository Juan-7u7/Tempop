// scripts/img.js
import axios from 'axios';

/**
 * Función para subir la imagen de perfil de un usuario.
 * @param {number} userId - El ID del usuario al que pertenece la imagen.
 * @param {string} profilePicture - La imagen en formato Base64.
 * @returns {Promise<string>} - Mensaje de éxito o error.
 */
export const uploadProfilePicture = async (userId, profilePicture) => {
  try {
    // Verificamos que ambos parámetros estén presentes
    if (!userId || !profilePicture) {
      throw new Error('El ID de usuario y la imagen son requeridos');
    }

    // Realizamos la solicitud POST para actualizar la imagen en la base de datos
    const response = await axios.post('http://localhost:3001/upload-profile-picture', {
      userId,
      profilePicture,
    });

    // Retornamos el mensaje de éxito recibido desde el servidor
    return response.data.message;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('Error al subir la imagen');
  }
};
