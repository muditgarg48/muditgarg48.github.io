const ArrowLeftIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className = '' }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
);

export default ArrowLeftIcon;