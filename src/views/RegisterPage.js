import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginRegister.css';
import { Container, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { EyeSlash, Eye } from 'react-bootstrap-icons'; // Importa los íconos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap


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
        <Container className="login-container">
            <h2 className="login-title">Registrarse</h2>
            {errors.form && <Alert variant="danger">{errors.form}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <FormControl 
                        type="text" 
                        isInvalid={!!errors.name}
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <FormControl 
                        type="email" 
                        isInvalid={!!errors.email}
                        value={email} 
                        onChange={handleEmailChange} 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
    
                <Form.Group className="mb-3">
    <Form.Label>Contraseña</Form.Label>
    <InputGroup className="password-input-group">
        <FormControl 
            type={passwordType}
            className={errors.password ? 'is-invalid' : ''} // Usamos className para controlar la visualización del borde rojo
            value={password} 
            onChange={handlePasswordChange}
            required 
        />
        <InputGroup.Text onClick={togglePasswordVisibility}>
            {passwordType === 'password' ? <Eye /> : <EyeSlash />}
        </InputGroup.Text>
    </InputGroup>
    {errors.password && <div className="error-message">{errors.password}</div>} {/* Mensaje de error personalizado */}
</Form.Group>

<Form.Group className="mb-3">
    <Form.Label>Confirmar Contraseña</Form.Label>
    <InputGroup className="password-input-group">
        <FormControl 
            type={confirmPasswordType}
            className={errors.confirmPassword ? 'is-invalid' : ''} // Control visual para el estado de error
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange}
            required 
        />
        <InputGroup.Text onClick={toggleConfirmPasswordVisibility}>
            {confirmPasswordType === 'password' ? <Eye /> : <EyeSlash />}
        </InputGroup.Text>
    </InputGroup>
    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>} {/* Mensaje de error personalizado */}
</Form.Group>

                
                <Button variant="primary" type="submit">Registrarse</Button>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-underline">¿Ya tienes cuenta? Inicia sesión</Link>
                </div>
            </Form>
        </Container>
    );
    
 
 
    
}

export default RegisterPage;