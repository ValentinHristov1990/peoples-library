import { useState } from 'react';
import { Link } from 'react-router';
import { loginUser } from './loginApi';
import { useLoginErrorHandler } from './loginErrorHandler';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Login() {

    const { login } = useAuth()
    const { loading, isLoading } = useLoading()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {
        formRef,
        touched,
        hasSubmitted,
        serverError,
        setServerError,
        handleBlur,
        getInputStyle,
        emailIsValid,
        passwordIsValid,
        validateCredentials,
        clearServerError,
    } = useLoginErrorHandler();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateCredentials(email, password)) return;

        try {
            await isLoading(async () => {
                const data = await loginUser({ email, password });
                login(data);
            })
        } catch (error) {
            setServerError(error.message || 'Invalid email or password!');
        }
    };

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <section className="form-container">
            <form ref={formRef} className="form-card" onSubmit={handleSubmit} noValidate>
                <h2 className="form-title">Login</h2>
                {serverError && (
                    <div className="error-tooltip-general" role="alert">
                        ⚠️ <span>{serverError}</span>
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
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearServerError();
                            }}
                            onBlur={() => handleBlur('email')}
                            style={getInputStyle(emailIsValid, 'email', hasSubmitted)}
                        />
                        {(touched.email || hasSubmitted) && !emailIsValid && (
                            <div className="error-tooltip">⚠️ Please enter a valid email address!</div>
                        )}
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearServerError();
                            }}
                            onBlur={() => handleBlur('password')}
                            style={getInputStyle(passwordIsValid, 'password', hasSubmitted)}
                        />
                        {(touched.password || hasSubmitted) && !passwordIsValid && (
                            <div className="error-tooltip">⚠️ Password is required!</div>
                        )}
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