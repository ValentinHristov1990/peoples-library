export default function Register() {
    return (
        <section className="register-container">
            <form action="/register" method="post">
                <h2>Register</h2>
                <input type="text" name="username" placeholder="Username" />
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>

        </section>
    );
}