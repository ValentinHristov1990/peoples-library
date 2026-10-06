import { useState } from 'react';

const GENRE_PRESETS = {
    'Fantasy & Sci-Fi': [
        '/fantasy/fantasy-img1.jpg',
        '/fantasy/fantasy-img2.jpg',
        '/fantasy/fantasy-img3.jpg'
    ],
    'Mystery & Thriller': [
        'mystery/mystery-img1.jpg',
        'mystery/mystery-img2.jpg',
        'mystery/mystery-img3.jpg'
    ],
    'Classics & Literature': [
        'classics/classics-img1.jpg',
        'classics/classics-img2.jpg',
        'classics/classics-img3.jpg'
    ],
    'Tech & Programming': [
        'tech/tech-img1.jpg',
        'tech/tech-img2.jpg',
        'tech/tech-img3.jpg'
    ],
    'History & Biography': [
        'history/history-img1.jpg',
        'history/history-img2.jpg',
        'history/history-img3.jpg'
    ],
    'Self-Improvement & Psychology': [
        'psychology/self-improvement-img1.jpg',
        'psychology/self-improvement-img2.jpg',
        'psychology/self-improvement-img3.jpg'
    ]
};

export default function Create() {
    const [category, setCategory] = useState('Fantasy & Sci-Fi');
    const [selectedImage, setSelectedImage] = useState(GENRE_PRESETS['Fantasy & Sci-Fi'][0]);
    const [useCustomUrl, setUseCustomUrl] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        if (!useCustomUrl && GENRE_PRESETS[newCategory]) {
            setSelectedImage(GENRE_PRESETS[newCategory][0]);
        }
    };

    const handlePresetSelect = (imgUrl) => {
        setUseCustomUrl(false);
        setSelectedImage(imgUrl);
    };

    const handleCustomUrlChange = (e) => {
        const val = e.target.value;
        setCustomUrl(val);
        setSelectedImage(val);
    };

    const handleToggleCustomUrl = () => {
        setUseCustomUrl(!useCustomUrl);
        if (useCustomUrl) {
            setSelectedImage(GENRE_PRESETS[category][0]);
        }
    }

    return (
        <section className="form-container">
            <form className="form-card form-card-wide">
                <h2 className="form-title">Create Shelf</h2>

                <div className="form-group">
                    <label htmlFor="title" className="form-label">Shelf Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-input"
                        placeholder="e.g. Epic Dark Fantasy Collection"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">Category / Genre</label>
                    <select
                        id="category"
                        name="category"
                        className="form-input"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        {Object.keys(GENRE_PRESETS).map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <div className="cover-header">
                        <label className="form-label">Shelf Cover</label>
                        <button
                            type="button"
                            className="toggle-custom-btn"
                            onClick={handleToggleCustomUrl}
                        >
                            {useCustomUrl ? 'Use Preset Covers' : 'Custom Image URL?'}
                        </button>
                    </div>

                    {!useCustomUrl ? (
                        <div className="preset-picker">
                            {GENRE_PRESETS[category]?.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    className={`preset-card ${selectedImage === imgUrl ? 'selected' : ''}`}
                                    onClick={() => handlePresetSelect(imgUrl)}
                                >
                                    <img src={imgUrl} alt={`Option ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://example.com/my-cover.jpg"
                            value={customUrl}
                            onChange={handleCustomUrlChange}
                            required
                        />
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-input"
                        placeholder="Short notes about what books belong in this shelf..."
                        rows="3"
                        required
                    ></textarea>
                </div>

                <input type="hidden" name="imageUrl" value={selectedImage} />

                <button type="submit" className="form-btn">
                    Add Shelf to Library
                </button>
            </form>
        </section>
    );
}