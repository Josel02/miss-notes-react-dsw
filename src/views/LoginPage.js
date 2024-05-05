import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginRegister.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // Estado para manejar los mensajes de error
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Asegurémonos de limpiar el estado de error en cada intento de inicio de sesión
        setLoginError('');
        axios.post('http://localhost:3000/users/login', { email, password })
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                login(response.data.userId, response.data.token, response.data.role);
                navigate('/');
            })
            .catch((error) => {
                // Asegurémonos de capturar el mensaje de error del servidor o establecer uno por defecto
                const errorMessage = error.response && error.response.data.message 
                    ? error.response.data.message 
                    : 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.';
                setLoginError(errorMessage);
            });
    };

    return (
        <>
            <div className="login-container">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label-login-register">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control-login-register form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label-login-register">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control-login-register form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {loginError && <div className="alert alert-danger" role="alert">{loginError}</div>}
                    <button type="submit" className="btn btn-primary btn-login-register">Iniciar Sesión</button>
                    <div className="mt-3 text-center">
                        <Link to="/register" className="text-decoration-underline text-decoration-underline-login-register">¿No tienes cuenta? Regístrate</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
