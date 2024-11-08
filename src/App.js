import './App.css';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import NavbarU from './components/navbar_u'; // Importa tu nuevo navbar
import Registro from './pages/registro'; // Importa tu componente de registro
import Login from './pages/login'; // Asegúrate de usar mayúscula inicial
import Inicio from './pages/inicio';
import Perfil from './pages/perfil';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';

function Layout({ children }) {
  const location = useLocation();
  const isInicioPage = location.pathname === '/inicio';
  const isPerfilPage = location.pathname === '/perfil';

  return (
    <>
      {/* Solo muestra un navbar basado en la ruta */}
      {isInicioPage || isPerfilPage ? <NavbarU /> : <ResponsiveAppBar />}
      {children}
    </>
  );
}

function AboutCard() {
  return (
    <Card sx={{ borderRadius: '16px', boxShadow: 3, padding: 2, marginBottom: 4 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          ¿Quienes somos?
        </Typography>
        <Typography variant="body1" component="ul" sx={{ fontSize: '1.5rem' }}>
          TempOp impulsa oportunidades laborales entre estudiantes y negocios locales.
          Ofrecemos publicación de vacantes, eventos de networking y desarrollo.
          Cada vacante es transparente en salarios, beneficios y requisitos para ambos lados.
        </Typography>
      </CardContent>
    </Card>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <div className="App">
          <Routes>
            <Route path="/" element={
              // Coloca aquí solo el contenido que deseas que se muestre en la página principal
              <Container>
                <Typography variant="h2" align="center" gutterBottom>
                  TempOp
                </Typography>
                <Box display="flex" justifyContent="center" mb={4}>
                  <img
                    src="https://www.un.edu.mx/wp-content/uploads/2021/11/Universidad-del-Norte-Como-se-puede-prevenir-y-afrontar-el-estres-academico-subtitulo.png"
                    alt="Imagen ilustrativa"
                    style={{ width: '300px', height: '300px', borderRadius: '50%' }} // Tamaño de la imagen ajustado
                  />
                </Box>

                <Typography variant="body1" component="ul" sx={{ fontSize: '1.5rem' }}>
                  <li>Desconexión entre personas y negocios
                    No existe un canal directo y accesible
                    para empleos a tiempo parcial.
                    Esto ralentiza contrataciones y oportunidades.
                  </li>
                  <li>Información incompleta sobre vacantes
                    Las vacantes carecen de detalles claros,
                    lo que genera incertidumbre y desconfianza.
                  </li>
                  <li>Baja participación de empresas locales
                    Pocas empresas publican vacantes online,
                    reduciendo opciones para los candidatos.
                  </li>
                  <li>Problemas de usabilidad en plataformas
                    Interfaces poco intuitivas afectan
                    la búsqueda y experiencia del usuario.
                  </li>
                  <li>Seguridad y privacidad de la información
                    Es crucial proteger los datos para
                    mantener la confianza en la plataforma.
                  </li>
                </Typography>

                {/* Incluye la tarjeta de "¿Quienes somos?" */}
                <AboutCard />

                <Typography variant="h4" align="center" gutterBottom>
                  Preguntas Frecuentes
                </Typography>
              </Container>
            } />
            <Route path="/register" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/logout" element={<Login />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
