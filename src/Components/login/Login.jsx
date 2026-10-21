import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const submitAction = async (formData) => {
        setErrorMessage('');
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            setErrorMessage('Please fill in both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            await onLogin({ email: email.trim(), password: password.trim() });
            navigate('/shelf');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="form-container">
            <form className="form-card" action={submitAction}>
                <h2 className="form-title">Login</h2>

                {errorMessage && (
                    <div style={{ backgroundColor: '#d32f2f', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' }}>
                        ⚠ {errorMessage}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="Your Email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="login-password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        name="password"
                        className="form-input"
                        placeholder="******"
                    />
                </div>

                <button type="submit" className="form-btn" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </section>
    );
}