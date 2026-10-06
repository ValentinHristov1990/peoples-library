// export default function Create() {
//     return (
//         <section className="form-container">
//             <form className="form-card">
//                 <h2 className="form-title">Create Shelf</h2>

//                 <div className="form-group">
//                     <label htmlFor="title" className="form-label">Shelf Title</label>
//                     <input
//                         type="text"
//                         id="title"
//                         name="title"
//                         className="form-input"
//                         placeholder="e.g. Favorite Fantasy"
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="category" className="form-label">Category</label>
//                     <select id="category" name="category" className="form-input" defaultValue="">
//                         <option value="" disabled>Select Category</option>
//                         <option value="Fantasy">Fantasy & Sci-Fi</option>
//                         <option value="Fiction">Fiction</option>
//                         <option value="Non-Fiction">Non-Fiction</option>
//                         <option value="Tech">Tech & Programming</option>
//                         <option value="Biography">Biography</option>
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="imageUrl" className="form-label">Cover Image URL</label>
//                     <input
//                         type="url"
//                         id="imageUrl"
//                         name="imageUrl"
//                         className="form-input"
//                         placeholder="https://..."
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="description" className="form-label">Description</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         className="form-input"
//                         placeholder="Notes about this shelf..."
//                         rows="3"
//                         required
//                     ></textarea>
//                 </div>

//                 <button type="submit" className="form-btn">
//                     Add to Library
//                 </button>
//             </form>
//         </section>
//     );
// }

import { useState } from 'react';

const GENRE_PRESETS = {
    'Fantasy & Sci-Fi': [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80'
    ],
    'Mystery & Thriller': [
        'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
    ],
    'Classics & Literature': [
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80'
    ],
    'Tech & Programming': [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
    ],
    'History & Biography': [
        'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=600&q=80'
    ],
    'Self-Improvement & Psychology': [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80'
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
                            onClick={() => {
                                setUseCustomUrl(!useCustomUrl);
                                if (useCustomUrl) {
                                    setSelectedImage(GENRE_PRESETS[category][0]);
                                }
                            }}
                        >
                            {useCustomUrl ? '← Use Preset Covers' : 'Custom Image URL?'}
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