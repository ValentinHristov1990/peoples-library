export default function ShelfCoverPicker({
    category,
    genrePresets,
    selectedImage,
    useCustomUrl,
    customUrl,
    onToggleCustom,
    onPresetSelect,
    onCustomUrlChange
}) {
    return (
        <div className="form-group">
            <div className="cover-header">
                <label className="form-label">Shelf Cover</label>
                <button
                    type="button"
                    className="toggle-custom-btn"
                    onClick={onToggleCustom}
                >
                    {useCustomUrl ? 'Use Preset Covers' : 'Custom Image URL?'}
                </button>
            </div>

            {!useCustomUrl ? (
                <div className="preset-picker">
                    {genrePresets[category]?.map((imgUrl, idx) => (
                        <div
                            key={idx}
                            className={`preset-card ${selectedImage === imgUrl ? 'selected' : ''}`}
                            onClick={() => onPresetSelect(imgUrl)}
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
                    onChange={onCustomUrlChange}
                    required
                />
            )}
        </div>
    );
}