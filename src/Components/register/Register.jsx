import { Link } from 'react-router-dom';

export default function Register() {
    return (
        <section className="form-container">
            <form className="form-card form-card-wide">
                <h2 className="form-title">Register</h2>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            placeholder="JohnDoe"
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
                            placeholder="******"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            className="form-input"
                            placeholder="******"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl" className="form-label">Profile Picture (URL)</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-input"
                        placeholder="https://..."
                    />
                </div>

                <button type="submit" className="form-btn">Register</button>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </section>
    );
}