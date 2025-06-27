import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function BackgroundParticles() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1, // Ensure particles stay in the background
        pointerEvents: "none", // Prevent particles from interfering with interactions
      }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          sx={{
            position: "absolute",
            width: { xs: 4, sm: 6, md: 8 },
            height: { xs: 4, sm: 6, md: 8 },
            bgcolor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </Box>
  );
}