import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SidebarPerfil from "../components/SidebarPerfil";
import { AuthContext } from "../context/AuthContext";
import "../assets/css/MisCompras.css";

const MisCompras = () => {
  const { usuario } = useContext(AuthContext);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      if (!usuario?.usuario?.id) return;

      try {
        const response = await fetch(
          `https://backend-market-8jdy.onrender.com/pedidos?usuario_id=${usuario.usuario.id}`
        );

        const data = await response.json();
        console.log("Respuesta cruda del backend:", data); // ✅ Para depuración

        // Validamos que lo recibido sea un array
        if (!Array.isArray(data)) {
          console.error("La respuesta no es un array:", data); // ✅ Error claro
          setCompras([]); // Evitamos errores si viene un objeto con error
          return;
        }

        // Agrupar productos por compra
        const comprasAgrupadas = {};

        data.forEach((item) => {
          if (!comprasAgrupadas[item.id]) {
            comprasAgrupadas[item.id] = {
              id: item.id,
              created_at: item.created_at,
              status: item.status,
              total: item.total,
              productos: [],
            };
          }

          comprasAgrupadas[item.id].productos.push({
            titulo: item.titulo,
            imagen: item.imagen,
            cantidad: item.cantidad,
            precio: item.precio_unitario,
          });
        });

        setCompras(Object.values(comprasAgrupadas));
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [usuario?.usuario?.id]);

  return (
    <div className="perfil-contenedor">
      <SidebarPerfil />
      <div className="compras-contenido">
        <h2>MIS COMPRAS</h2>

        {loading ? (
          <p>Cargando compras...</p>
        ) : compras.length === 0 ? (
          <div className="sin-compras">
            <p>No has realizado ninguna compra.</p>
            <button
              className="btn-ver-productos"
              onClick={() => navigate("/publicaciones")}
            >
              Revisa nuestros productos aquí
            </button>
          </div>
        ) : (
          compras.map((compra) => (
            <div key={compra.id} className="tarjeta-compra">
              <div className="compra-encabezado">
                <span
                  className={`estado ${
                    compra.status ? compra.status.toLowerCase() : "pendiente"
                  }`}
                >
                  {compra.status || "Pendiente"}
                </span>
              </div>

              <p className="fecha-compra">
                Fecha: {new Date(compra.created_at).toLocaleDateString("es-CL")}
              </p>

              <div className="productos-comprados">
                {compra.productos.map((producto, index) => (
                  <div key={index} className="producto-item">
                    <img
                      src={producto.imagen || "https://via.placeholder.com/80"}
                      alt={producto.titulo}
                      className="producto-imagen"
                    />
                    <div className="producto-detalle">
                      <p><strong>{producto.titulo}</strong></p>
                      <p>Cantidad: {producto.cantidad}</p>
                      <p>Precio: ${Number(producto.precio).toLocaleString("es-CL")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="resumen-total">
                <h4>Total: ${Number(compra.total).toLocaleString("es-CL")}</h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MisCompras;
