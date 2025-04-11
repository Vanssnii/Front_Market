/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import CardProducto from "./CardProducto";
import '../assets/css/GaleriaDestacados.css';

function GaleriaDestacados({ search }) {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("https://backend-market-8jdy.onrender.com/productos");
        const productos = response.data.data || response.data;

        console.log(productos);

        // Filtrar productos similares
        const productosFiltrados = productos.filter(producto => producto.titulo.toLowerCase().includes(search ? search.toLowerCase() : ''));
        const productosAleatorios = productosFiltrados.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductosDestacados(productosAleatorios);
      } catch (error) {
        console.error("Error al obtener productos destacados", error);
      }
    };

    fetchProductos();
  }, [search]);

  return (
    <div className="galeria-destacados">
      {productosDestacados.map((producto) => (
        <CardProducto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}


export default GaleriaDestacados;


 