import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import request from '../utils/request';
import { GENRE_PRESETS } from '../../books-data/genrePresets';
import BookCoverPicker from '../create/BookCoverPicker';

export default function Edit() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Fantasy & Sci-Fi',
        description: '',
    });

    const [useCustomUrl, setUseCustomUrl] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');

    useEffect(() => {
        async function fetchBookDetails() {
            try {
                const [book] = await request(`/books?id=eq.${bookId}`, 'GET');
                if (book) {
                    setFormData({
                        title: book.title || '',
                        author: book.author || '',
                        genre: book.genre || 'Fantasy & Sci-Fi',
                        description: book.description || '',
                    });
                    setImageUrl(book.imageUrl || '');
                    const genrePresetList = GENRE_PRESETS[book.genre] || [];
                    if (genrePresetList.includes(book.imageUrl)) {
                        setSelectedPreset(book.imageUrl);
                        setUseCustomUrl(false);
                    } else {
                        setUseCustomUrl(true);
                    }
                }
            } catch (error) {
                alert(`Error loading book: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBookDetails();
    }, [bookId]);

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
            alert("Title, Author, and Description are required!");
            return;
        }

        setIsSaving(true);

        try {
            await request(`/books?id=eq.${bookId}`, 'PATCH', {
                title: formData.title.trim(),
                author: formData.author.trim(),
                genre: formData.genre,
                imageUrl: imageUrl.trim() || 'https://via.placeholder.com/150',
                description: formData.description.trim(),
            });

            navigate(`/details/${bookId}`);
        } catch (error) {
            alert(`Failed to update book: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="form-container">
                <div className="form-card text-center">
                    <p style={{ color: '#f5f2eb' }}>Loading book details...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="form-container">
            <form className="form-card form-card-wide" onSubmit={handleSubmit}>
                <h2 className="form-title">Edit Book</h2>

                <div className="form-group">
                    <label htmlFor="title" className="form-label">Book Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-input"
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
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="modal-details-actions" style={{ marginTop: '20px' }}>
                    <button type="submit" className="form-btn" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
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