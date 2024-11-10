const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Para manejar archivos binarios

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'tempopiidb'
};

// Pool de conexiones en lugar de una única conexión
const pool = mysql.createPool(dbConfig);

// Configuración de multer para recibir la imagen en formato binario
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/get-user-id', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Nombre de usuario requerido' });
  }

  const sql = 'SELECT id FROM usuarios WHERE usuario = ?';
  pool.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error al obtener el ID del usuario:', err);
      return res.status(500).json({ message: 'Error al obtener el ID del usuario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ userId: results[0].id });
  });
});


// Ruta para manejar la carga de la foto de perfil en formato binario
app.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  const { userId } = req.body;
  const profilePicture = req.file?.buffer;

  // Verifica que se hayan proporcionado el userId y la imagen
  if (!userId || !profilePicture) {
    console.error("Error: ID de usuario y foto de perfil son requeridos");
    return res.status(400).json({ message: 'ID de usuario y foto de perfil son requeridos' });
  }

  // Consulta para actualizar la columna foto_perfil con el archivo binario
  const sql = 'UPDATE usuarios SET foto_perfil = ? WHERE id = ?';

  pool.query(sql, [profilePicture, userId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la foto de perfil en la base de datos:', err);
      return res.status(500).json({ message: 'Error al actualizar la foto de perfil' });
    }

    res.status(200).json({
      message: 'Foto de perfil actualizada exitosamente'
    });
  });
});
// Ruta para manejar la actualización del perfil subir datos y asi
app.post('/update-profile', upload.single('profilePicture'), (req, res) => {
  const { userId, descripcion, habilidades, experiencia, contacto } = req.body;
  const profilePicture = req.file?.buffer;

  const sql = `
  UPDATE usuarios 
  SET foto_perfil = ?, descripcion = ?, habilidades = ?, experiencia = ?, contacto = ? 
  WHERE id = ?
`;


  pool.query(sql, [profilePicture, descripcion, habilidades, experiencia, contacto, userId], (err, result) => {
    if (err) {
      console.error('Error al actualizar el perfil:', err);
      return res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
  });
});


// Ruta para manejar el registro de usuarios
app.post('/registro', (req, res) => {
  const { usuario, nombre, correo, tipo, contraseña } = req.body;
  
  if (!usuario || !nombre || !correo || !tipo || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const sql = 'INSERT INTO usuarios (usuario, nombre, correo, tipo, contraseña) VALUES (?, ?, ?, ?, ?)';
  
  pool.query(sql, [usuario, nombre, correo, tipo, contraseña], (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      return res.status(500).json({ 
        message: 'Error al registrar el usuario', 
        error: err.message 
      });
    }
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId: result.insertId 
    });
  });
});

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  
  if (!usuario || !contraseña) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?';
  
  pool.query(sql, [usuario, contraseña], (err, result) => {
    if (err) {
      console.error('Error al verificar credenciales:', err);
      return res.status(500).json({ message: 'Error al verificar credenciales' });
    }
    
    if (result.length > 0) {
      res.json({ 
        success: true, 
        user: { 
          id: result[0].id,             // Asegúrate de incluir el ID
          usuario: result[0].usuario,
          nombre: result[0].nombre,
          tipo: result[0].tipo,
          foto_perfil: result[0].foto_perfil // Retorna la imagen de perfil en binario si existe
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }
  });
});

app.get('/get-profile-picture', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario requerido' });
  }

  const sql = 'SELECT foto_perfil FROM usuarios WHERE id = ?';
  pool.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la foto de perfil:', err);
      return res.status(500).json({ message: 'Error al obtener la foto de perfil' });
    }
    
    // Verificar si hay resultados
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si hay foto de perfil
    if (!results[0].foto_perfil) {
      return res.status(404).json({ message: 'No hay foto de perfil' });
    }

    // Enviar la imagen
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache de 1 hora
    res.send(results[0].foto_perfil);
  });
});


// Ruta para manejar el cierre de sesión
app.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Sesión cerrada exitosamente' 
  });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

