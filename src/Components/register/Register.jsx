import { Link, useNavigate } from 'react-router-dom';
import request from '../service/request';

export default function Register({
    onRegister,
}) {
    const navigate = useNavigate();

    const registerActionHandler = async (formData) => {
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");

        if (!username || !email || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await request('/users', 'POST', {
                username,
                email,
                password,
            });
            onRegister({ username, email });
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <section className="form-container">
            <form className="form-card form-card-wide" action={registerActionHandler}>
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

                <button type="submit" className="form-btn">Register</button>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </section>
    );
}