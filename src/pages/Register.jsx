import '../assets/css/Register.css'; 
import { Link } from "react-router-dom";
import registerImg from '../assets/img/Register/Sale_image.jpg';
import { useState } from 'react';
import avatar1 from '../assets/img/Register/icon1.png';
import avatar2 from '../assets/img/Register/icon2.png';
import avatar3 from '../assets/img/Register/icon3.png';
import avatar4 from '../assets/img/Register/icon4.png';

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    avatar: ''  // Nuevo campo para almacenar el avatar seleccionado
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatar) => {
    setForm((prevForm) => ({
      ...prevForm,
      avatar: avatar  
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backend-market-8jdy.onrender.com/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form) // Aquí mandas el form con el avatar (nombre del avatar, no la URL)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);
      // Redirigir al login después del registro exitoso
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="page-container">
      <div className="box">
        <div className="imagen-izquierda">
          <img src={registerImg} alt="Promo registro" />
        </div>
        <div className="registro">
          <div className="text-wrapper-2">REGISTRO</div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            required
            className="input-field"
          />

          {/* Opciones de Avatar */}
          <div className="avatar-selection">
            <label htmlFor="avatar">Selecciona un avatar:</label>
            <div className="avatar-options">
              <img
                src={avatar1}
                alt="Avatar 1"
                className={`avatar-option ${form.avatar === 'avatar1' ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('avatar1')}
              />
              <img
                src={avatar2}
                alt="Avatar 2"
                className={`avatar-option ${form.avatar === 'avatar2' ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('avatar2')}
              />
              <img
                src={avatar3}
                alt="Avatar 3"
                className={`avatar-option ${form.avatar === 'avatar3' ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('avatar3')}
              />
              <img
                src={avatar4}
                alt="Avatar 4"
                className={`avatar-option ${form.avatar === 'avatar4' ? 'selected' : ''}`}
                onClick={() => handleAvatarSelect('avatar4')}
              />
            </div>
          </div>

          {/* Botón de registro */}
          <button type="button" onClick={handleSubmit} className="submit-btn">Registrarme</button>

          <p className="tienes-cuenta">
            <span className="span">¿Tienes cuenta? </span>
            <span className="text-wrapper-3"><Link to="/login" className="link-login">Ingresa aquí</Link></span> 
          </p>
        </div>
      </div>
    </div>
  );
};


export default Register;
