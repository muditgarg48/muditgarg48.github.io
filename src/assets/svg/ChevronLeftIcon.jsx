const ChevronLeftIcon = ({ size = 16, color = 'currentColor', strokeWidth = 2.5, className = '' }) => (
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
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export default ChevronLeftIcon;