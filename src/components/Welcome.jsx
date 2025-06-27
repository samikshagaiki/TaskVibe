import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BotCharacter } from "./BotCharacter";

export default function Welcome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const navigate = useNavigate();

  const welcomeMessages = [
    "Hello there! 👋",
    "Welcome to TaskVibe!",
    "Ready to crush your tasks?",
    "Let's make productivity fun!",
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setShowWelcome(true), 500);
    const timer2 = setTimeout(() => setShowSpeechBubble(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (showSpeechBubble) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showSpeechBubble, welcomeMessages.length]);

  const handleGetStarted = () => {
    navigate("/tasks");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100dvh",
        background: "linear-gradient(135deg,rgb(42, 0, 71),rgb(34, 67, 158),rgb(81, 76, 226))",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 4 },
        py: { xs: 2, sm: 4 },
        textAlign: "center",
      }}
    >
      {/* Background Particles */}
      <Box sx={{ position: "absolute", inset: 0 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
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

      {/* Speech Bubble */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        <AnimatePresence>
          {showSpeechBubble && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                width: "max-content",
                maxWidth: "90vw",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "white",
                  borderRadius: "16px",
                  px: 3,
                  py: 1.5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  border: "2px solid #90caf9",
                  display: "inline-block",
                }}
              >
                <motion.div
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    color: "#1f2937",
                    fontWeight: 500,
                    fontSize: "1rem",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {welcomeMessages[currentMessage]}
                </motion.div>

                {/* Tail */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "8px solid white",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% - 2px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "8px solid #90caf9",
                  }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* BotCharacter with Glow */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: -150, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{ position: "relative" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
              style={{
                cursor: "pointer",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: { xs: 150, sm: 200, md: 220 } }}>
                <BotCharacter size="100%" />
              </Box>
            </motion.div>

            {/* Glow */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.3))",
                filter: "blur(20px)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title and Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ marginTop: "1.5rem" }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            fontWeight: "bold",
            color: "white",
            textShadow: "0 0 30px rgba(124, 58, 237, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 30px rgba(124, 58, 237, 0.8)",
                "0 0 40px rgba(59, 130, 246, 0.8)",
                "0 0 30px rgba(124, 58, 237, 0.8)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            TaskVibe
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles size={40} color="#facc15" />
          </motion.span>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "white",
            opacity: 0.9,
            maxWidth: 600,
            mx: "auto",
            mt: 2,
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          Your ultimate to-do companion. Let our friendly bot guide you to crush your tasks with style and fun!
        </Typography>
      </motion.div>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        style={{ marginTop: "1.5rem" }}
      >
        <Button
          variant="contained"
          onClick={handleGetStarted}
          startIcon={<ArrowRight size={20} />}
          sx={{
            bgcolor: "#7c3aed",
            "&:hover": { bgcolor: "#6d28d9", transform: "scale(1.05)" },
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 20,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.4)",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Let's Get Started
        </Button>
      </motion.div>
    </Box>
  );
}
