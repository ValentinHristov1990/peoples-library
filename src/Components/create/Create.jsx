import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import request from '../utils/request';
import BookCoverPicker from './BookCoverPicker';
import { useNotification } from '../notifications/Notification';
import AuthContext from '../../context/authContext';
import { GENRE_PRESETS } from '../../constants/genrePresets';

export default function Create() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Fantasy & Sci-Fi',
        description: '',
    });

    const [useCustomUrl, setUseCustomUrl] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handlePresetSelect = (imgUrl) => {
        setSelectedPreset(imgUrl);
        setImageUrl(imgUrl);
    };

    const handleToggleCustom = () => {
        setUseCustomUrl(!useCustomUrl);
        setImageUrl('');
        setSelectedPreset('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
            showNotification('Title, Author, and Description are required!', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await request('/books', 'POST', {
                title: formData.title.trim(),
                author: formData.author.trim(),
                genre: formData.genre,
                imageUrl: imageUrl.trim() || 'https://via.placeholder.com/150',
                description: formData.description.trim(),
                user_id: user?.id,
            });

            showNotification('Book successfully added to catalog!');
            navigate('/catalog');
        } catch (error) {
            showNotification(`Failed to add book: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="form-container">
            <form className="form-card form-card-wide" onSubmit={handleSubmit}>
                <h2 className="form-title">Add a Book</h2>

                <div className="form-group">
                    <label htmlFor="title" className="form-label">Book Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-input"
                        placeholder="Enter book title..."
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author" className="form-label">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        className="form-input"
                        placeholder="Enter author name..."
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <select
                        id="genre"
                        name="genre"
                        className="form-input"
                        value={formData.genre}
                        onChange={handleChange}
                    >
                        {Object.keys(GENRE_PRESETS).map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <BookCoverPicker
                    category={formData.genre}
                    genrePresets={GENRE_PRESETS}
                    selectedImage={selectedPreset}
                    useCustomUrl={useCustomUrl}
                    customUrl={imageUrl}
                    onToggleCustom={handleToggleCustom}
                    onPresetSelect={handlePresetSelect}
                    onCustomUrlChange={(e) => setImageUrl(e.target.value)}
                />

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-input"
                        rows="4"
                        placeholder="Write a short summary or description of the book..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="modal-details-actions" style={{ marginTop: '20px' }}>
                    <button type="submit" className="form-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Book to Catalog'}
                    </button>
                    <button
                        type="button"
                        className="form-btn shelf-btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
}