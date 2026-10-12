import { useState } from 'react';
import { GENRE_PRESETS } from '../../books-data/genrePresets';
import ShelfCoverPicker from './ShelfCoverPicker';

export default function Create() {
    const [category, setCategory] = useState('Fantasy & Sci-Fi');
    const [selectedImage, setSelectedImage] = useState(GENRE_PRESETS['Fantasy & Sci-Fi'][0]);
    const [useCustomUrl, setUseCustomUrl] = useState(true);
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
        const nextState = !useCustomUrl;
        setUseCustomUrl(nextState);
        if (nextState) {
            setSelectedImage(GENRE_PRESETS[category][0]);
        }
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

                <ShelfCoverPicker
                    category={category}
                    genrePresets={GENRE_PRESETS}
                    selectedImage={selectedImage}
                    useCustomUrl={useCustomUrl}
                    customUrl={customUrl}
                    onToggleCustom={handleToggleCustomUrl}
                    onPresetSelect={handlePresetSelect}
                    onCustomUrlChange={handleCustomUrlChange}
                />

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