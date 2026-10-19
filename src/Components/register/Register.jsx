import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            setErrorMessage('Password should be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
            });

            setSuccessMessage('Account created successfully! Redirecting...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="form-container">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Register</h2>

                {successMessage && (
                    <div style={{
                        backgroundColor: '#2e7d32',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                        ✓ {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div style={{
                        backgroundColor: '#d32f2f',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                        ⚠ {errorMessage}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="form-btn" disabled={isLoading || !!successMessage}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </section>
    );
}