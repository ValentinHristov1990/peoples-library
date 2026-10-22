import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import request from '../utils/request';
import { GENRE_PRESETS } from '../../books-data/genrePresets';
import BookCoverPicker from './BookCoverPicker';
import AuthContext from '../../context/authContext';

export default function Create() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Fantasy & Sci-Fi',
        description: '',
    });

    const [useCustomUrl, setUseCustomUrl] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));

        if (name === 'category') {
            setSelectedPreset('');
            if (!useCustomUrl) setImageUrl('');
        }
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
            alert("Title, Author, and Description are required!");
            return;
        }

        const finalImageUrl = imageUrl.trim() || 'https://via.placeholder.com/150';

        setIsLoading(true);

        try {
            await request('/books', 'POST', {
                title: formData.title.trim(),
                author: formData.author.trim(),
                genre: formData.category,
                imageUrl: finalImageUrl,
                description: formData.description.trim(),
                user_id: user.id,
            });

            alert('Book successfully added to catalog!');
            navigate('/catalog');
        } catch (error) {
            alert(`Failed to add book: ${error.message}`);
        } finally {
            setIsLoading(false);
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
                        placeholder="e.g. The Hobbit"
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
                        placeholder="e.g. J. R. R. Tolkien"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">Genre</label>
                    <select
                        id="category"
                        name="category"
                        className="form-input"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {Object.keys(GENRE_PRESETS).map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <BookCoverPicker
                    category={formData.category}
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
                        placeholder="Add a short description of the book..."
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="form-btn" disabled={isLoading}>
                    {isLoading ? 'Adding Book...' : 'Add Book to Catalog'}
                </button>
            </form>
        </section>
    );
}