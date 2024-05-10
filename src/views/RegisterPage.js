import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginRegister.css';
import { Container, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { EyeSlash, Eye } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
        } else {
            const { email, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handlePasswordChange = (e) => {
        const passwordVal = e.target.value;
        setPassword(passwordVal);
        if (passwordVal && passwordVal.length < 8) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
        } else {
            const { password, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordVal = e.target.value;
        setConfirmPassword(confirmPasswordVal);
        if (confirmPasswordVal !== password) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
            const { confirmPassword, ...rest } = errors;
            setErrors(rest);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        // Clear previous errors
        setErrors(prevErrors => ({ ...prevErrors, form: '' }));

        // Check for any validation errors
        if (!name || !email || !password || !confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, form: 'All fields are required.' }));
            return;
        }
        if (Object.keys(errors).length > 0) {
            setErrors(prevErrors => ({ ...prevErrors, form: 'Please fix the errors in the form.' }));
            return;
        }
        
        try {
            await axios.post('http://localhost:3000/users/register', { name, email, password });
            navigate('/login'); // Redirect user to login page after successful registration
        } catch (error) {
            let errorMessage = 'Error connecting to server. Please try again later.';
            
            // Check if response data and error message exist
            if (error.response && error.response.data) {
                // Here we adapt to check if error.response.data.error is a string
                const errorData = error.response.data.error || error.response.data.message;
                if (typeof errorData === 'string' && errorData.includes('duplicate key error')) {
                    errorMessage = 'A user with that email is already registered.';
                } else {
                    // If it's not a duplicate key error, use API's error message if available
                    errorMessage = error.response.data.message || errorMessage;
                }
            }
            setErrors(prevErrors => ({ ...prevErrors, form: errorMessage }));
        }
    };

    return (
        <>
        <Container className="login-container">
            <h2 className="login-title">Register</h2>
            {errors.form && <Alert variant="danger">{errors.form}</Alert>}
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label className='form-label-login-register'>Full Name</Form.Label>
                    <FormControl 
                        type="text" 
                        isInvalid={!!errors.name}
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className='form-control-login-register'
                        required 
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label className='form-label-login-register'>Email</Form.Label>
                    <FormControl 
                        type="email" 
                        isInvalid={!!errors.email}
                        value={email} 
                        onChange={handleEmailChange}
                        className='form-control-login-register'
                        required
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </Form.Group>
    
                <Form.Group className="mb-3">
                    <Form.Label className='form-label-login-register'>Password</Form.Label>
                    <InputGroup className="password-input-group">
                        <FormControl 
                            type={passwordType}
                            isInvalid={!!errors.password}
                            value={password} 
                            onChange={handlePasswordChange}
                            className='form-control-login-register'
                            required 
                        />
                        <InputGroup.Text onClick={togglePasswordVisibility} className='password-visibility'>
                            {passwordType === 'password' ? <Eye /> : <EyeSlash />}
                        </InputGroup.Text>
                    </InputGroup>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </Form.Group>
    
                <Form.Group className="mb-3">
                    <Form.Label className='form-label-login-register'>Confirm Password</Form.Label>
                    <InputGroup className="password-input-group">
                        <FormControl 
                            type={confirmPasswordType}
                            isInvalid={!!errors.confirmPassword}
                            value={confirmPassword} 
                            onChange={handleConfirmPasswordChange}
                            className='form-control-login-register'
                            required 
                        />
                        <InputGroup.Text onClick={toggleConfirmPasswordVisibility} className='password-visibility'>
                            {confirmPasswordType === 'password' ? <Eye /> : <EyeSlash />}
                        </InputGroup.Text>
                    </InputGroup>
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </Form.Group>
    
                <Button variant="primary" type="submit" style={{ margin: '20px auto 0', display: 'block', width: 'auto' }} className='btn-login-register btn-primary-custom'>Register</Button>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-underline text-decoration-underline-login-register">Already have an account? Log in</Link>
                </div>
            </Form>
        </Container>
        </>
    );
}

export default RegisterPage;
