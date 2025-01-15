import React from 'react';

const Spinner = () => {
    return (
        <div style={{
            width: '30px',
            height: '30px',
            border: '5px solid rgba(0, 0, 0, 0.1)',
            borderTop: '5px solid #703FD9', // Customize the color as needed
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin:"0 auto",
        }} />
    );
};

// Add this CSS to your global styles or a CSS file
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

const SpinnerWithStyles = () => {
    return (
        <>
            <style>{spinnerStyles}</style>
            <Spinner />
        </>
    );
};

export default SpinnerWithStyles;
