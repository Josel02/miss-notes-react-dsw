import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
        setErrors(prevErrors => ({ ...prevErrors, form: '' })); // Limpiar errores anteriores
        
        try {
            await axios.post('http://localhost:3000/users/register', { name, email, password });
            navigate('/login'); // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
        } catch (error) {
            let errorMessage = 'Error al conectar con el servidor. Por favor, intenta de nuevo más tarde.';
            
            // Verificar que los datos de la respuesta y el mensaje de error existan
            if (error.response && error.response.data) {
                // Aquí adaptamos para revisar si error.response.data.error es una cadena
                const errorData = error.response.data.error || error.response.data.message;
                if (typeof errorData === 'string' && errorData.includes('duplicate key error')) {
                    errorMessage = 'Ya existe un usuario registrado con ese correo electrónico.';
                } else {
                    // Si no es un error de clave duplicada, usa el mensaje de error de la API si está disponible
                    errorMessage = error.response.data.message || errorMessage;
                }
            }
            setErrors(prevErrors => ({ ...prevErrors, form: errorMessage }));
        }
    };
    

    return (
        <div className="login-container">
            <h2 className="login-title">Registrarse</h2>
            {errors.form && <div className="alert alert-danger" role="alert">{errors.form}</div>}
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre Completo</label>
                    <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" value={email} onChange={handleEmailChange} required />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3 password-field">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type={passwordType} className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" value={password} onChange={handlePasswordChange} required />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordType === 'password' ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                    </span>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3 password-field">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input type={confirmPasswordType} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                    <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                        {confirmPasswordType === 'password' ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                    </span>
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Registrarse</button>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-underline">¿Ya tienes cuenta? Inicia sesión</Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;