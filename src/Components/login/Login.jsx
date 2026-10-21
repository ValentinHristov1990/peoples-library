import { useState } from 'react';
import { Link } from 'react-router';
import { loginUser } from './loginApi';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const data = await loginUser({ email, password });
            onLogin(data);
        } catch (error) {
            setErrors({ general: error.message || 'Invalid email or password!' });
        }
    };

    return (
        <section className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Login</h2>

                {errors.general && (
                    <div className="error-tooltip-general">
                        ⚠️ <span>{errors.general}</span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">EMAIL</label>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="login-password" className="form-label">PASSWORD</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            className="form-input"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="form-btn">Login</button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </section>
    );
}