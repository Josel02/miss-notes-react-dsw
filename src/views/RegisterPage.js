// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginRegister.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }
        // Lógica para manejar el registro (ej: llamada a API)
        // Si el registro es exitoso, puedes redirigir al usuario:
        // navigate('/login');
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Registrarse</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre Completo</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    {passwordError && <div className="password-error">{passwordError}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Registrarse</button>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-underline">¿Ya tienes cuenta? Inicia sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
