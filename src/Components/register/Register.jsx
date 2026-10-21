import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Register({ onRegister }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const registerActionHandler = async (formData) => {
        setErrorMessage('');
        setSuccessMessage('');

        const { username, email, password, confirmPassword } = Object.fromEntries(formData);

        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password should be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            await onRegister({
                username: username,
                email: email,
                password: password,
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
            <form className="form-card" action={registerActionHandler}>
                <h2 className="form-title">Register</h2>

                {successMessage && (
                    <div style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' }}>
                        ✓ {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div style={{ backgroundColor: '#d32f2f', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' }}>
                        ⚠ {errorMessage}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" id="username" name="username" className="form-input" placeholder="john_doe" />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email" className="form-input" placeholder="john@example.com" />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" name="password" className="form-input" placeholder="••••••••" />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" className="form-input" placeholder="••••••••" />
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