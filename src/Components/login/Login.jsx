import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <section className="form-container">
            <form className="form-card">
                <h2 className="form-title">Login</h2>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="******"
                        required
                    />
                </div>

                <button type="submit" className="form-btn">Login</button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </section>
    );
}