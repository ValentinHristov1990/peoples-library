import { useState } from 'react';
import { Link } from 'react-router';
import { registerUser } from './registerApi';
import useAuth from '../../Components/hooks/useAuth';
import useLoading from '../hooks/useLoading';
import LoadingSpinner from '../common/LoadingSpinner';


export default function Register() {

    const { register } = useAuth()
    const { loading, isLoading } = useLoading();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!username) newErrors.username = 'Username is required!';
        if (!email) newErrors.email = 'Email is required!';
        if (!password) newErrors.password = 'Password is required!';
        if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters!';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match!';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await isLoading(async () => {
                const data = await registerUser({ username, email, password });
                register(data);
            })
        } catch (error) {
            setErrors({ general: error.message || 'Registration failed. Please try again.' });
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Register</h2>

                {errors.general && (
                    <div className="error-error-tooltip-general error-tooltip-general">
                        ⚠️ <span>{errors.general}</span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username" className="form-label">USERNAME</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            placeholder="john_doe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {errors.username && (
                            <div className="error-tooltip">
                                ⚠️ <span>{errors.username}</span>
                            </div>
                        )}
                    </div>
                </div>

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
                            required
                        />
                        {errors.email && (
                            <div className="error-tooltip">
                                ⚠️ <span>{errors.error_tooltip || errors.email}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">PASSWORD</label>
                    <div className="input-parser input-wrapper">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && (
                            <div className="error-tooltip">
                                ⚠️ <span>{errors.password}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="******"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errors.confirmPassword && (
                            <div className="error-tooltip">
                                ⚠️ <span>{errors.confirmPassword}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" className="form-btn">Register</button>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </section>
    );
}