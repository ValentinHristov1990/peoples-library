import { useState } from 'react';
import { GENRE_PRESETS } from '../../books-data/genrePresets';

export default function Create() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'Fantasy & Sci-Fi',
        imageUrl: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    return (
        <section className="form-container">
            <form className="form-card form-card-wide" onSubmit={(e) => e.preventDefault()}>
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

                <div className="form-group">
                    <label htmlFor="imageUrl" className="form-label">Book Cover URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-input"
                        placeholder="https://example.com/book-cover.jpg"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

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

                <button type="submit" className="form-btn">
                    Add Book to Shalf
                </button>
            </form>
        </section>
    );
}