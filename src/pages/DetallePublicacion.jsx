import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";
import "../assets/css/DetallePublicacion.css";

function DetallePublicacion() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito, carrito, disminuirCantidad } = useContext(CarritoContext);

  const mapCategoriaIdToNombre = {
    1: "hombre",
    2: "mujer",
    3: "accesorios",
    4: "tecnologia"
  };

  useEffect(() => {
    axios.get(`https://backend-market-8jdy.onrender.com/productos/${id}`)
      .then((res) => {
        const productoData = res.data.data || res.data;
        console.log("Datos del producto recibidos:", productoData);
        setProducto(productoData);
        
        const imagePath = productoData.image || productoData.imagen;
        if (imagePath) {
          setImagenes([imagePath, imagePath + "?1", imagePath + "?2"]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener producto", err);
      });
  }, [id]);

  useEffect(() => {
    if (!producto) return;
    const cantidadEnCarrito = carrito.find((item) => item.id === producto.id)?.cantidad || 0;
    setCantidad(Math.max(cantidadEnCarrito, 1));
  }, [producto, carrito]);

  const handleAgregar = () => {
    if (!producto || cantidad <= 0) return;

    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito({
        ...producto,
        vendedor_id: producto.usuario_id || producto.vendedor_id,
      });
    }
  };

  if (!producto) return <p>Cargando producto...</p>;

  const titulo = producto.title || producto.titulo || "Sin título";
  const precio = producto.price || producto.precio || 0;
  const categoria = producto.category || mapCategoriaIdToNombre[producto.categoria_id] || "Sin categoría";
  const descripcion = producto.description || producto.descripcion || "Sin descripción";
  const stock = producto.stock || 0;

  return (
    <div className="detalle-container">
      <div className="detalle-imagenes">
        <div className="imagen-principal">
          {imagenes.length > 0 ? (
            <img src={imagenes[imagenSeleccionada]} alt={titulo} />
          ) : (
            <div className="no-imagen">Imagen no disponible</div>
          )}
        </div>
        <div className="miniaturas">
          {imagenes.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`mini ${index}`}
              onClick={() => setImagenSeleccionada(index)}
              className={index === imagenSeleccionada ? "miniatura activa" : "miniatura"}
            />
          ))}
        </div>
      </div>

      <div className="detalle-info">
        <h2 className="detalle-titulo">{titulo}</h2>
        <p className="detalle-precio">${Number(precio).toLocaleString('es-CL')}</p>

        <div className="detalle-descripcion">
          <p><strong>Tipo de Producto:</strong> {categoria}</p>
          <p><strong>Descripción:</strong> {descripcion}</p>        
          <p><strong>Stock:</strong> {stock}</p>       
        </div>

        <div className="detalle-cantidad">
          <p><strong>Cantidad:</strong></p>
          <div className="cantidad-control">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button
              onClick={() => {
                if (cantidad < stock) setCantidad(cantidad + 1);
              }}
              disabled={cantidad >= stock}
            >+</button>
          </div>
        </div>

        <button className="btn-agregar" onClick={handleAgregar} disabled={stock === 0}>
          {stock === 0 ? "Sin stock disponible" : "AGREGAR AL CARRITO"}
        </button>
      </div>
    </div>
  );
}


export default DetallePublicacion;

