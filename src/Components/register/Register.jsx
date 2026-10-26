import { useState } from 'react';
import { Link } from 'react-router';
import { registerUser } from './registerApi';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';
import LoadingSpinner from '../common/LoadingSpinner';
import { useRegisterValidation } from './registerErrorhandler';

export default function Register() {
    const { register } = useAuth();
    const { loading, isLoading } = useLoading();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {
        formRef,
        touched,
        hasSubmitted,
        serverError,
        setServerError,
        handleBlur,
        getInputStyle,
        validateUsername,
        validateEmail,
        validatePassword,
        validateConfirm,
        validateForm,
    } = useRegisterValidation();

    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirm(confirmPassword, password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm({ username, email, password, confirmPassword })) return;

        try {
            await isLoading(async () => {
                const data = await registerUser({ username, email, password });
                register(data);
            });
        } catch (error) {
            setServerError(error.message || 'Registration failed. Please try again.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="form-container">
            <form ref={formRef} className="form-card" onSubmit={handleSubmit} noValidate>
                <h2 className="form-title">Register</h2>

                {serverError && (
                    <div className="error-tooltip-general">
                        ⚠️ <span>{serverError}</span>
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
                            onBlur={() => handleBlur('username')}
                            style={getInputStyle(isUsernameValid, 'username', hasSubmitted)}
                        />
                        {(touched.username || hasSubmitted) && !isUsernameValid && (
                            <div className="error-tooltip">
                                ⚠️ {username.includes('@') ? 'Username cannot contain "@"!' : 'Username cannot be empty!'}
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
                            onBlur={() => handleBlur('email')}
                            style={getInputStyle(isEmailValid, 'email', hasSubmitted)}
                        />
                        {(touched.email || hasSubmitted) && !isEmailValid && (
                            <div className="error-tooltip">
                                ⚠️ Please enter a valid email address!
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">PASSWORD</label>
                    <div className="input-wrapper">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                            style={getInputStyle(isPasswordValid, 'password', hasSubmitted)}
                        />
                        {(touched.password || hasSubmitted) && !isPasswordValid && (
                            <div className="error-tooltip">
                                ⚠️ Password must be at least 6 characters!
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
                            onBlur={() => handleBlur('confirmPassword')}
                            style={getInputStyle(isConfirmValid, 'confirmPassword', hasSubmitted)}
                        />
                        {(touched.confirmPassword || hasSubmitted) && !isConfirmValid && (
                            <div className="error-tooltip">
                                ⚠️ Passwords do not match!
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