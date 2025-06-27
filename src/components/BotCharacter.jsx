import { motion } from "framer-motion"; 

export function BotCharacter({ className = "", size = 200 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ filter: "drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))" }}
    >
      {/* Bot Shadow */}
      <ellipse cx="100" cy="180" rx="30" ry="8" fill="rgba(0,0,0,0.2)" opacity="0.5" />

      {/* Bot Body */}
      <motion.ellipse
        cx="100"
        cy="130"
        rx="45"
        ry="50"
        fill="url(#bodyGradient)"
        animate={{
          scaleY: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bot Head */}
      <motion.circle
        cx="100"
        cy="70"
        r="35"
        fill="url(#headGradient)"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Screen on chest */}
      <rect x="85" y="120" width="30" height="20" rx="5" fill="url(#screenGradient)" opacity="0.8" />

      {/* Screen reflection */}
      <rect x="87" y="122" width="12" height="16" rx="2" fill="rgba(255,255,255,0.3)" />

      {/* Left Antenna */}
      <motion.g
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "85px 45px" }}
      >
        <line x1="85" y1="45" x2="85" y2="25" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="22" r="5" fill="#60A5FA" />
        <circle cx="85" cy="22" r="3" fill="#93C5FD" />
      </motion.g>

      {/* Right Antenna */}
      <motion.g
        animate={{
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ transformOrigin: "115px 45px" }}
      >
        <line x1="115" y1="45" x2="115" y2="25" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="115" cy="22" r="5" fill="#60A5FA" />
        <circle cx="115" cy="22" r="3" fill="#93C5FD" />
      </motion.g>

      {/* Left Eye */}
      <motion.ellipse
        cx="90"
        cy="65"
        rx="6"
        ry="8"
        fill="#1F2937"
        animate={{
          scaleY: [1, 0.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right Eye */}
      <motion.ellipse
        cx="110"
        cy="65"
        rx="6"
        ry="8"
        fill="#1F2937"
        animate={{
          scaleY: [1, 0.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mouth */}
      <motion.path
        d="M 90 80 Q 100 88 110 80"
        stroke="#1F2937"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{
          d: ["M 90 80 Q 100 88 110 80", "M 90 82 Q 100 90 110 82", "M 90 80 Q 100 88 110 80"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left Blush */}
      <circle cx="70" cy="75" r="8" fill="#F472B6" opacity="0.6" />

      {/* Right Blush */}
      <circle cx="130" cy="75" r="8" fill="#F472B6" opacity="0.6" />

      {/* Left Arm */}
      <motion.ellipse
        cx="60"
        cy="110"
        rx="12"
        ry="25"
        fill="url(#armGradient)"
        animate={{
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "60px 95px" }}
      />

      {/* Right Arm */}
      <motion.ellipse
        cx="140"
        cy="110"
        rx="12"
        ry="25"
        fill="url(#armGradient)"
        animate={{
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ transformOrigin: "140px 95px" }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}