import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import request from '../service/request';

export default function Login({
    onLogin,
}) {

    const navigate = useNavigate();

    const loginActionHandler = async (formData) => {
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const users = await request(`/users?email=eq.${email}`, "GET");
            const matchedUser = users.find(u => u.email === email && u.password === password);

            if (!matchedUser) {
                alert("Invalid email or password");
                return;
            }
            onLogin(matchedUser);
            navigate("/");
        } catch (error) {
            alert(error.message);
        }

    }
    return (
        <section className="form-container">
            <form className="form-card" action={loginActionHandler}>
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