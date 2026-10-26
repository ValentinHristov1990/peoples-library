export default function BookCoverPicker({
    category,
    genrePresets,
    selectedImage,
    useCustomUrl,
    imageUrl,
    onToggleCustom,
    onPresetSelect,
    onImageUrlChange,
    imageUrlStyle,
    imageUrlError,
    onImageUrlBlur,
}) {
    const availablePresets = genrePresets[category] || [];

    return (
        <div className="form-group">
            <div className="cover-header">
                <label className="form-label">Book Cover</label>
                <button
                    type="button"
                    className="toggle-custom-btn"
                    onClick={onToggleCustom}
                >
                    {useCustomUrl ? 'Custom Image URL?' : 'Use Preset Covers'}
                </button>
            </div>

            {!useCustomUrl ? (
                <div className="preset-picker">
                    {availablePresets.length > 0 ? (
                        availablePresets.map((imgUrl, idx) => (
                            <div
                                key={idx}
                                className={`preset-card ${selectedImage === imgUrl ? 'selected' : ''}`}
                                onClick={() => onPresetSelect(imgUrl)}
                            >
                                <img src={imgUrl} alt={`Cover option ${idx + 1}`} />
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: '#aaa', fontStyle: 'italic' }}>
                            No preset covers available for this genre. Please use a Custom URL.
                        </p>
                    )}
                </div>
            ) : (
                <div className="input-wrapper">
                    <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/my-cover.jpg"
                        value={imageUrl}
                        onChange={onImageUrlChange}
                        onBlur={onImageUrlBlur}
                        style={imageUrlStyle}
                    />
                    {imageUrlError && (
                        <div className="error-tooltip">⚠️ {imageUrlError}</div>
                    )}
                </div>
            )}
        </div>
    );
}