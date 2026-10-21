import { useState } from 'react';
import { Link } from 'react-router';

export default function Login({ onLogin }) {
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitAction = async (formData) => {
        const { email, password } = Object.fromEntries(formData);
        setErrors({});

        const newErrors = {};
        if (!email) newErrors.email = 'Email is required!';
        if (!password) newErrors.password = 'Password is required!';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onLogin({ email, password });
        } catch (error) {
            setErrors({ general: error.message || 'Invalid email or password!' });
        }
    };

    return (
        <section className="form-container">
            <form className="form-card" action={submitAction}>
                <h2 className="form-title">Login</h2>

                {errors.general && (
                    <div className="error-tooltip-general">
                        ⚠️ <span>{errors.general}</span>
                    </div>
                )}

                <div className="form-group" style={{ position: 'relative' }}>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <div className="error-tooltip">
                            ⚠️ <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label htmlFor="login-password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        name="password"
                        className="form-input"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <div className="error-tooltip">
                            ⚠️ <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                <button type="submit" className="form-btn">Login</button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </section>
    );
}