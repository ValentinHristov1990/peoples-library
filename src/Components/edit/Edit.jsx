import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import request from '../utils/request';
import BookCoverPicker from '../create/BookCoverPicker';
import { useNotification } from '../notifications/useNotification';
import { GENRE_PRESETS } from '../../constants/genrePresets';
import { useBookFormErrorHandler } from '../create/bookFormErrorHandler';

export default function Edit() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Fantasy & Sci-Fi',
        description: '',
    });

    const [useCustomUrl, setUseCustomUrl] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        formRef,
        serverError,
        setServerError,
        hasSubmitted,
        fieldErrors,
        isFieldVisible,
        handleBlur,
        getInputStyle,
        validateForm,
        clearServerError,
    } = useBookFormErrorHandler({ formData, imageUrl, useCustomUrl });

    useEffect(() => {
        async function fetchBook() {
            try {
                const data = await request(`/books?id=eq.${bookId}`);
                if (data && data.length > 0) {
                    const book = data[0];
                    setFormData({
                        title: book.title || '',
                        author: book.author || '',
                        genre: book.genre || 'Fantasy & Sci-Fi',
                        description: book.description || '',
                    });
                    const currentImg = book.imageUrl || book.imageurl || '';
                    setImageUrl(currentImg);

                    const isPreset = Object.values(GENRE_PRESETS).flat().includes(currentImg);
                    if (isPreset) {
                        setSelectedPreset(currentImg);
                        setUseCustomUrl(false);
                    } else if (currentImg) {
                        setUseCustomUrl(true);
                    }
                }
            } catch (error) {
                showNotification(`Failed to load book data: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchBook();
    }, [bookId, showNotification]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
        clearServerError();
    };

    const handlePresetSelect = (imgUrl) => {
        setSelectedPreset(imgUrl);
        setImageUrl(imgUrl);
        clearServerError();
    };

    const handleToggleCustom = () => {
        setUseCustomUrl(!useCustomUrl);
        setImageUrl('');
        setSelectedPreset('');
        clearServerError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await request(`/books?id=eq.${bookId}`, 'PATCH', {
                title: formData.title.trim(),
                author: formData.author.trim(),
                genre: formData.genre,
                imageUrl: imageUrl.trim() || 'https://via.placeholder.com/150',
                description: formData.description.trim(),
            });

            showNotification('Book updated successfully!');
            navigate(`/details/${bookId}`);
        } catch (error) {
            setServerError(`Failed to update book: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="form-container">
                <p style={{ color: '#fff', textAlign: 'center' }}>Loading book data...</p>
            </div>
        );
    }

    return (
        <section className="form-container">
            <form ref={formRef} className="form-card form-card-wide" onSubmit={handleSubmit} noValidate>
                <h2 className="form-title">Edit Book</h2>

                {serverError && (
                    <div className="error-tooltip-general" role="alert">
                        ⚠️ <span>{serverError}</span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="title" className="form-label">Book Title</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-input"
                            placeholder="e.g., The Great Gatsby"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={() => handleBlur('title')}
                            style={getInputStyle(!fieldErrors.title, 'title', hasSubmitted)}
                        />
                        {isFieldVisible('title') && fieldErrors.title && (
                            <div className="error-tooltip">⚠️ {fieldErrors.title}</div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="author" className="form-label">Author</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            id="author"
                            name="author"
                            className="form-input"
                            placeholder="e.g., F. Scott Fitzgerald"
                            value={formData.author}
                            onChange={handleChange}
                            onBlur={() => handleBlur('author')}
                            style={getInputStyle(!fieldErrors.author, 'author', hasSubmitted)}
                        />
                        {isFieldVisible('author') && fieldErrors.author && (
                            <div className="error-tooltip">⚠️ {fieldErrors.author}</div>
                        )}
                    </div>
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
                    imageUrl={imageUrl}
                    onToggleCustom={handleToggleCustom}
                    onPresetSelect={handlePresetSelect}
                    onImageUrlChange={(e) => {
                        setImageUrl(e.target.value);
                        clearServerError();
                    }}
                    onImageUrlBlur={() => handleBlur('imageUrl')}
                    imageUrlStyle={getInputStyle(!fieldErrors.imageUrl, 'imageUrl', hasSubmitted)}
                    imageUrlError={isFieldVisible('imageUrl') ? fieldErrors.imageUrl : ''}
                />

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <div className="input-wrapper">
                        <textarea
                            id="description"
                            name="description"
                            className="form-input"
                            placeholder="Write a short summary or description of the book..."
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={() => handleBlur('description')}
                        ></textarea>
                        {isFieldVisible('description') && fieldErrors.description && (
                            <div className="error-tooltip">⚠️ {fieldErrors.description}</div>
                        )}
                    </div>
                </div>

                <div className="modal-details-actions" style={{ marginTop: '20px' }}>
                    <button type="submit" className="form-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
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