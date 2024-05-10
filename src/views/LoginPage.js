import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginRegister.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // State to handle error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Make sure to clear the error state on each login attempt
        setLoginError('');
        axios.post('http://localhost:3000/users/login', { email, password })
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                login(response.data.userId, response.data.token, response.data.role);
                navigate('/notes');
            })
            .catch((error) => {
                // Make sure to capture the server error message or set a default one
                const errorMessage = error.response && error.response.data.message 
                    ? error.response.data.message 
                    : 'An unexpected error occurred. Please try again later.';
                setLoginError(errorMessage);
            });
    };

    return (
        <>
            <div className="login-container">
                <h2 className="login-title">Log In</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label-login-register">Email Address</label>
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
                        <label htmlFor="password" className="form-label-login-register">Password</label>
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
                    <button type="submit" style={{ margin: '20px auto 0', display: 'block', width: 'auto' }} className="btn btn-primary-custom btn-login-register">Log In</button>
                    <div className="mt-3 text-center">
                        <Link to="/register" className="text-decoration-underline text-decoration-underline-login-register">Don't have an account? Sign Up</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
