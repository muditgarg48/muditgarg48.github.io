const IndustryIcon = ({ size = 32, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
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
        <rect x="4" y="3" width="16" height="18" rx="2" ry="2"/>
        <path d="M9 21V9h6v12"/><path d="M12 5h.01"/><path d="M12 9h.01"/><path d="M12 13h.01"/><path d="M12 17h.01"/>
    </svg>
);

export default IndustryIcon;