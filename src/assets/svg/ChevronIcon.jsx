const ChevronIcon = ({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {} }) => (
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
        style={style}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export default ChevronIcon;