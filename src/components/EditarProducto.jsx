import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../assets/css/EditarProducto.css';

function EditarProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    imagen: ""
  });
  const [categorias, setCategorias] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`https://backend-market-8jdy.onrender.com/productos/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto", error);
      }
    };

    fetchProducto();
  }, [id]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`https://backend-market-8jdy.onrender.com/categorias`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías", error);
      }
    };

    fetchCategorias();
  }, [ ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backend-market-8jdy.onrender.com/productos/${id}`, producto);
      console.log("Producto actualizado:", producto);
      alert("Producto actualizado con éxito");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al actualizar el producto", error);
    }
  };

  return (
    <div className="container">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input type="text" id="titulo" name="titulo" value={producto.titulo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input type="number" id="precio" name="precio" value={producto.precio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen URL:</label>
          <input type="text" id="imagen" name="imagen" value={producto.imagen} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Cantidad:</label>
          <input type="number" id="stock" name="stock" value={producto.stock} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select id="categoria" name="categoria_id" value={producto.categoria} onChange={handleChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea id="descripcion" name="descripcion" value={producto.descripcion} onChange={handleChange} required />
        </div>
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
}


export default EditarProducto;