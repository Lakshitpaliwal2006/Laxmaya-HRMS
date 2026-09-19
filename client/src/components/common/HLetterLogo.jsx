import { useTheme } from "../../context/ThemeContext.jsx";

export const LaxmayaLogoText = ({ 
  className = '', 
  fontSize = '42px', 
  showTagline = false,
  taglineText = "Connect. Scale. Succeed."
}) => {
  const { isDark } = useTheme();

  // Unique ID for the gradient to avoid conflicts if multiple logos are on the page
  const gradientId = "laxmaya-gradient";

  return (
    <div className={`flex flex-col items-start ${className}`}>
      {/* SVG for the exact Laxmaya Wordmark */}
      <svg
        viewBox="0 0 800 220"
        width="100%"
        height="24"
        style={{ maxWidth: '400px', fontSize }}
        className="shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient matching the image: Orange -> Pink -> Purple */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />     {/* Amber / Orange */}
            <stop offset="30%" stopColor="#ec4899" />    {/* Pink / Magenta */}
            <stop offset="70%" stopColor="#a855f7" />    {/* Purple */}
            <stop offset="100%" stopColor="#8b5cf6" />   {/* Indigo / Violet */}
          </linearGradient>
        </defs>

        {/* 
          Using text with a modern, rounded sans-serif font.
          The 'L' is styled to match the tall ascender in the image.
        */}
        <text
          x="0"
          y="75%"
          fontFamily="'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="800"
          fontSize="180"
          fill={`url(#${gradientId})`}
          letterSpacing="-4"
          dominantBaseline="middle"
        >
          Laxmaya
        </text>
      </svg>

      {showTagline && (
        <span className={`mt-1 text-xs font-medium tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {taglineText}
        </span>
      )}
    </div>
  );
};

/**
 * Main Logo component wrapper (keeps the same export name for compatibility)
 */
export const HLetterLogo = ({
  iconSize = 42, // kept for prop compatibility, not used directly
  showBadge = true, // kept for compatibility
  showTagline = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <LaxmayaLogoText 
        fontSize="42px" 
        showTagline={showTagline} 
      />
    </div>
  );
};

export default HLetterLogo;