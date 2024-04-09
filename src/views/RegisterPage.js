import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginRegister.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [passwordType, setPasswordType] = useState('password');
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');

    const togglePasswordVisibility = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
    };

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleEmailChange = (e) => {
        const emailVal = e.target.value;
        setEmail(emailVal);
        if (emailVal && !validateEmail(emailVal)) {
            setErrors(prev => ({ ...prev, email: 'Formato de correo no válido' }));
        } else {
            const { email, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handlePasswordChange = (e) => {
        const passwordVal = e.target.value;
        setPassword(passwordVal);
        if (passwordVal && passwordVal.length < 8) {
            setErrors(prev => ({ ...prev, password: 'La contraseña debe tener al menos 8 caracteres' }));
        } else {
            const { password, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordVal = e.target.value;
        setConfirmPassword(confirmPasswordVal);
        if (confirmPasswordVal !== password) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
        } else {
            const { confirmPassword, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0 && password === confirmPassword && validateEmail(email)) {
            //lógica para manejar el registro, por ejemplo, una llamada a API
            console.log('Registro exitoso'); // Simula un registro exitoso
            // navigate('/login'); // Descomenta esta línea para redirigir al usuario después del registro exitoso
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Registrarse</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre Completo</label>
                    <input type="text" className={`form-control ${errors.name ? 'error' : ''}`} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} id="email" value={email} onChange={handleEmailChange} required />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                <div className="mb-3 password-field">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type={passwordType} className={`form-control ${errors.password ? 'error' : ''}`} id="password" value={password} onChange={handlePasswordChange} required />
                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password" title={passwordType === 'password' ? "Mostrar contraseña" : "Ocultar contraseña"}>
                        {passwordType === 'password' ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                    </button>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <div className="mb-3 password-field">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input type={confirmPasswordType} className={`form-control ${errors.confirmPassword ? 'error' : ''}`} id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="toggle-password" title={confirmPasswordType === 'password' ? "Mostrar contraseña" : "Ocultar contraseña"}>
                        {confirmPasswordType === 'password' ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                    </button>
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
