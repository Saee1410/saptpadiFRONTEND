



import React, { useState } from 'react';
import axios from 'axios';
import './AIStyleGenerator.css';

const AIStyleGenerator = () => {

    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const suggestions = [
        'Traditional Maharashtrian', 'Modern Royal', 'Red Decor','Pink Decor',
        'Garden Venue', 'Golden Mandap', 'Destination Wedding'
    ];

    const addSuggestion = (tag) => {
        setPrompt((prev) => (prev ? `${prev}, ${tag}` : tag));
    };

    const handleGenerate = async () => {
        if (!prompt) return alert('Please enter something!');

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/ai/generate-style',
               // { prompt }
                {
        prompt: `Traditional Maharashtrian wedding, ${prompt}, mandap decoration`
    }
            );

            console.log("Image URL:", response.data.imageUrl);

            if (response.data.success) {
                setGeneratedImage(response.data.imageUrl);
            }
        } catch (err) {
            console.error("Generation Error:", err);
            setError("AI busy now, try again later!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ai-generator-page'>

            <h1 className='page-title'>
                AI wedding <span className='gold'>Style Generator</span>
            </h1>

            <p className='page-subtitle'>
                Discover your perfect wedding style with our AI-powered generator.
            </p>

            <div className='genrator-container'>

                <div className='input-box'>
                    <label>Describe Your Dream Wedding:</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Maharashtrian, red & gold, royal, garden venue...'
                        rows={5}
                    />
                </div>

                <div className='suggestion-box'>
                    <p>Suggestions:</p>
                    <div className='tags-list'>
                        {suggestions.map((tag, index) => (
                            <span
                                key={index}
                                className='tag'
                                onClick={() => addSuggestion(tag)}
                            >
                                {tag} +
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    className='generate-btn'
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                >
                    {loading ? 'Generating Magically...' : 'Generate Style Image'}
                </button>

            </div>

            <div className='image-display-section'>

                {loading && (
                    <div className='loader-box'>
                        <div className='spinner'></div>
                        <p>Creating your personalized wedding style...</p>
                    </div>
                )}

                {error && <p className='error-msg'>{error}</p>}

                {generatedImage && (
                    <div className='result-box'>

                        <h3>AI Generated Mood Board</h3>

                       

                 <img
                      src={generatedImage}
                      alt="Wedding Style"
                      className='generated-img'
                      onLoad={() => console.log("✅ Image loaded")}
                      onError={(e) => {
                       console.log("❌ Image failed → fallback");
                      e.target.src = "https://picsum.photos/800/600";
                 }}
/>

                       


                        <div className='action-btns'>

                            {/* Download */}
                            <button
                                className='save-btn'
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = generatedImage;
                                    link.download = "wedding-style.jpg";
                                    link.click();
                                }}
                            >
                                Download Image
                            </button>

                            {/* Open */}
                            <button
                                className='share-btn'
                                onClick={() => window.open(generatedImage, '_blank')}
                            >
                                Open in New Tab ↗
                            </button>

                            {/* Share */}
                            <button
                                className='share-btn'
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedImage);
                                    alert("Link copied! Share anywhere 💌");
                                }}
                            >
                                Share with Family
                            </button>

                        </div>

                    </div>
                )}

                {!loading && !generatedImage && !error && (
                    <div className='placeholder-box'>
                        <p>Your dream decor image will appear here.</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default AIStyleGenerator;