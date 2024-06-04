import React from 'react';

const GardeningTips = () => {
    const tips = [
        "Start small, with easy-to-grow vegetables like lettuce, radishes, and herbs.",
        "Use high-quality organic soil rich in compost to ensure your plants get the nutrients they need.",
        "Consider vertical gardening to save space and grow more.",
    ];

    return (
        <div className="gardening-tips">
            <h3>Backyard Gardening Tips</h3>
            <ul>
                {tips.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
};

export default GardeningTips;
