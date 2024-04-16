import React, { useState } from 'react';
import '../LoginForm/LoginForm.css';

const LoginForm: React.FC = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }

            const responseData = await response.json();
            console.log('Login successful', responseData);
        } catch (error) {
            console.error('Login failed', error);
            setLoginError('Login failed. Please try again.');
        }
    };

    return (
        <div className='login-form'>
            <div className='login-form__header'>
                <h1>Login</h1>
            </div>
            <div className='login-form__body'>
                <form onSubmit={login}>
                    <div className='form-group'>
                        <label htmlFor='username'>Username</label>
                        <input type='text' id='username' name='username' value={formData.username} onChange={handleChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} />
                    </div>
                    <button type='submit'>Login</button>
                </form>
                {loginError && 
                    <div className='error-message'>{loginError}</div>
                }
            </div>
        </div>
    );
};

export default LoginForm;
