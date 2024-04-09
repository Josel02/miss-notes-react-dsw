import React, { useState } from 'react';
import Layout from '../layouts/Layout';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de importar Link de 'react-router-dom'
import '../styles/LoginRegister.css'; // Asegúrate de que la ruta relativa sea correcta según la estructura de tu proyecto

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Aquí tu lógica para manejar el inicio de sesión
        // Por ejemplo:
        // axios.post('/api/login', { email, password })
        //     .then((response) => {
        //         console.log(response.data);
        //         navigate('/'); // Redirecciona a la página principal si el login es exitoso
        //     })
        //     .catch((error) => {
        //         console.error("Error al iniciar sesión:", error);
        //         // Maneja errores de inicio de sesión aquí, como mostrar un mensaje al usuario
        //     });
    };

    return (
        <Layout>
            <div className="login-container">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    <div className="mt-3 text-center">
                        <Link to="/register" className="text-decoration-underline">¿No tienes cuenta? Regístrate</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default LoginPage;
