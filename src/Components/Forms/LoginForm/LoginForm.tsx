import React, { useState, useRef } from 'react';

const LoginForm: React.FC = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const usernameRef = useRef<HTMLInputElement>(null); // Ref for username input element
    const passwordRef = useRef<HTMLInputElement>(null); // Ref for password input element

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = usernameRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        console.log({ username, password });
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
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
        <div className='project-creation-form'> {/* Apply project-creation-form class */}
            <div className='login-form-overlay'>
                <div className='login-form'>
                    <div className='login-form__header'>
                        <h1>Login</h1>
                    </div>
                    <div className='login-form__body'>
                        <form onSubmit={login}>
                            <div className='form-group'>
                                <label htmlFor='username'>Username</label>
                                <input type='text' id='username' name='username' ref={usernameRef} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Password</label>
                                <input type='password' id='password' name='password' ref={passwordRef} />
                            </div>
                            <button type='submit'>Login</button>
                        </form>
                        {loginError && 
                            <div className='error-message'>{loginError}</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;