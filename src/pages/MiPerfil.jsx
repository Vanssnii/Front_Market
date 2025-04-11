import { useEffect, useState, useContext } from "react";
import axios from "axios";
import SidebarPerfil from "../components/SidebarPerfil";
import PublicacionCard from "../components/PublicacionCard";
import { AuthContext } from "../context/AuthContext"; // Asegúrate que la ruta sea correcta
import "../assets/css/MiPerfil.css";

function MiPerfil() {
  const [publicaciones, setPublicaciones] = useState([]);
  // Obtenemos el valor completo del contexto y lo renombramos a contextValue para claridad
  const { usuario: contextValue } = useContext(AuthContext);

  // Log para ver el valor crudo del contexto cuando cambia (útil para depurar)
  useEffect(() => {
    console.log("MiPerfil Effect - Valor crudo del contexto:", contextValue);
  }, [contextValue]);

  useEffect(() => {
    // *** CAMBIO IMPORTANTE AQUÍ ***
    // Verificamos si el contextValue existe, si el objeto anidado 'usuario' existe DENTRO de contextValue,
    // y si ese objeto anidado tiene una propiedad 'id'.
    if (contextValue && contextValue.usuario && contextValue.usuario.id) {
      // Accedemos al ID desde el objeto anidado 'usuario'
      const userId = contextValue.usuario.id;
      console.log("MiPerfil Effect - ID de usuario encontrado correctamente:", userId); // <-- Debería mostrar el ID ahora

      console.log(`Buscando publicaciones para el user ID: ${userId}`);

      axios.get("https://backend-market-8jdy.onrender.com/productos", { // Endpoint correcto para obtener productos
        params: {
          vendedor_id: userId // Filtramos por el ID del vendedor (usuario logueado)
        }
      })
        .then(response => {
          // Adaptamos por si la respuesta usa HATEOAS (datos dentro de 'data') o no
          const fetchedPublicaciones = response.data.data || response.data;
          console.log("Publicaciones recibidas:", fetchedPublicaciones);
          // Nos aseguramos de que siempre establezcamos un array en el estado
          setPublicaciones(Array.isArray(fetchedPublicaciones) ? fetchedPublicaciones : []);
        })
        .catch(error => {
          console.error("Error al obtener publicaciones", error);
          setPublicaciones([]); // Limpiamos las publicaciones en caso de error
        });
    } else {
      // Esta condición ahora se cumple correctamente si contextValue, contextValue.usuario, o contextValue.usuario.id faltan
      console.log("MiPerfil Effect - Datos de usuario o ID no disponibles en el contexto todavía.");
      setPublicaciones([]); // Limpiamos si no hay usuario
    }
    // El efecto debe depender del valor completo del contexto que estamos usando
  }, [contextValue]); // Dependemos de contextValue

  // *** Actualizamos la lógica de renderizado ***
  // Verificamos si el usuario está logueado basado en la estructura correcta del contextValue
  const isLoggedIn = contextValue && contextValue.usuario && contextValue.usuario.id;
  // Verificamos si hay publicaciones
  const hasPublications = publicaciones.length > 0;

  return (
    <div className="perfil-container">
      <SidebarPerfil />
      <main className="main-content">
        <h2>MIS PUBLICACIONES</h2>
        <div className="publicaciones-grid">
          {/* Mensaje si no está logueado */}
          {!isLoggedIn && <p>Inicia sesión para ver tus publicaciones.</p>}
          {/* Mensaje si está logueado pero no tiene publicaciones */}
          {isLoggedIn && !hasPublications && <p>No tienes publicaciones aún.</p>}
          {/* Mapeo de publicaciones si está logueado y tiene publicaciones */}
          {isLoggedIn && hasPublications && (
            publicaciones.map((p) => (
              <PublicacionCard key={p.id} publicacion={p} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default MiPerfil;
