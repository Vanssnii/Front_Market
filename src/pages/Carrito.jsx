import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import SidebarPerfil from "../components/SidebarPerfil";
import "../assets/css/Carrito.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Carrito({}) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    carrito,
    calcularTotal,
    vaciarCarrito,
    agregarAlCarrito,
    disminuirCantidad,
  } = useContext(CarritoContext);
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const handlePagar = async () => {
    setIsProcessing(true);
    try {
      // First update stock for all products
      await Promise.all(
        carrito.map(async (item) => {
          await axios.put(`https://backend-market-8jdy.onrender.com/productos/${item.id}`, {
            ...item,
            stock: (item.stock || item.cantidad_disponible) - item.cantidad,
          });
        })
      );

      // Then create the order
      const response = await fetch("https://backend-market-8jdy.onrender.com/pedidos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: usuario?.usuario?.id,
          carrito: carrito.map((item) => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            precio: item.precio,
            vendedor_id: item.vendedor_id,
          })),
        }),
      });

      if (!response.ok) throw new Error("Error al crear el pedido");
      const data = await response.json();
      console.log(data);


      setShowSuccessMessage(true);
      vaciarCarrito();

      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsProcessing(false);
        navigate("/resumen-compra", {
          state: { carrito, total: calcularTotal() },
        });
      }, 3000);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar tu pedido");
      setIsProcessing(false);
    }
  };

  return (
    <div className="carrito-container">
      <SidebarPerfil />
      <main className="carrito-main">
        <div className="carrito-productos">
          <h2>CARRITO DE COMPRAS</h2>
          {carrito.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <img
                  src={item.image || item.imagen}
                  alt={item.title || item.titulo}
                />
                <div className="carrito-item-info">
                  <h4>{item.title || item.titulo}</h4>
                  <p>
                    TALLA {item.talla || "S"} - {item.color || "BLANCO"}
                  </p>
                </div>
                <div className="carrito-cantidad">
                  <button onClick={() => disminuirCantidad(item.id)}>-</button>
                  <span>{item.cantidad}</span>
                  <button
                    onClick={() => agregarAlCarrito(item)}
                    disabled={
                      item.cantidad >=
                      (item.stock || item.cantidad_disponible || Infinity)
                    }
                  >
                    +
                  </button>
                </div>
                <p className="carrito-precio">
                  ${Number(item.precio).toLocaleString("es-CL")}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="carrito-resumen">
          <h3>RESUMEN</h3>
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                {item.title || item.titulo}
                <br />${Number(item.precio).toLocaleString("es-CL")} x{" "}
                {item.cantidad}
              </li>
            ))}
          </ul>
          <hr />
          <p>
            <strong>TOTAL:</strong> ${calcularTotal().toLocaleString("es-CL")}
          </p>
          <button onClick={handlePagar} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "PAGAR"}
          </button>
          {showSuccessMessage && (
            <div className="success-message">¡Compra realizada con éxito!</div>
          )}
        </div>
      </main>
    </div>
  );
}


export default Carrito;
