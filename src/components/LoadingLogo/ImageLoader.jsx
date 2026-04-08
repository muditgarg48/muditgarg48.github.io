import { useState } from 'react';
import LoadingLogo from './LoadingLogo';
import './LoadingLogo.css';

/**
 * ImageLoader Component
 * Wraps an <img> and shows LoadingLogo (Minor) until the image is loaded.
 */
const ImageLoader = ({ src, alt, className, imgClassName, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`image-loader-container ${className || ''}`} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', objectFit: 'cover', ...style }}>
            {!isLoaded && !hasError && (
                <div className="image-loader-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    background: 'rgba(0,0,0,0.05)'
                }}>
                    <LoadingLogo isMajor={false} />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`${imgClassName || ''} ${isLoaded ? 'loaded' : 'loading'}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                {...props}
            />
        </div>
    );
};

export default ImageLoader;
