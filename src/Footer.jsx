import { FaFacebook, FaInstagram } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p className="footer-brand">
                    People's Library &copy; {new Date().getFullYear()}
                </p>
                <div className="social-links">

                    <a href="https://www.facebook.com/profile.php?id=100001440473524"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="Facebook"
                    ><FaFacebook size={22} /></a>

                    <a href="https://www.instagram.com/v.hristov90/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        aria-label="Instagram"
                    ><FaInstagram size={22} /></a>
                </div>
            </div>
        </footer>
    );
}