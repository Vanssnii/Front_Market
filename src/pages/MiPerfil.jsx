import { useEffect, useState, useContext } from "react";
import axios from "axios";
import SidebarPerfil from "../components/SidebarPerfil";
import PublicacionCard from "../components/PublicacionCard";
import { AuthContext } from "../context/AuthContext";
import "../assets/css/MiPerfil.css";

function MiPerfil() {
  const [publicaciones, setPublicaciones] = useState([]);
  const { usuario: contextValue } = useContext(AuthContext);

  useEffect(() => {
    console.log("MiPerfil Effect - Valor crudo del contexto:", contextValue);
  }, [contextValue]);

  useEffect(() => {
    if (contextValue && contextValue.usuario && contextValue.usuario.id) {
      const userId = contextValue.usuario.id;
      console.log("MiPerfil Effect - ID de usuario encontrado correctamente:", userId);
      console.log(`Buscando publicaciones para el user ID: ${userId}`);

      axios.get("https://backend-market-8jdy.onrender.com/productos", {
        params: {
          vendedor_id: userId
        }
      })
        .then(response => {
          const fetchedPublicaciones = response.data.data || response.data;
          console.log("Publicaciones recibidas:", fetchedPublicaciones);
          setPublicaciones(Array.isArray(fetchedPublicaciones) ? fetchedPublicaciones : []);
        })
        .catch(error => {
          console.error("Error al obtener publicaciones", error);
          setPublicaciones([]);
        });
    } else {
      console.log("MiPerfil Effect - Datos de usuario o ID no disponibles en el contexto todavía.");
      setPublicaciones([]);
    }
  }, [contextValue]);

  const isLoggedIn = contextValue && contextValue.usuario && contextValue.usuario.id;
  const hasPublications = publicaciones.length > 0;

  return (
    <div className="perfil-container">
      <SidebarPerfil />
      <main className="main-content">
        <h2>MIS PUBLICACIONES</h2>
        <div className="publicaciones-grid">
          {!isLoggedIn && <p>Inicia sesión para ver tus publicaciones.</p>}
          {isLoggedIn && !hasPublications && <p>No tienes publicaciones aún.</p>}
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
