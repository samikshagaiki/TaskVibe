import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  Fade, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon, 
  SmartToy as RobotIcon
} from '@mui/icons-material';
import axios from 'axios';

const Chatbot = ({ onAddTask, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage('bot', `🤖 Hello ${user?.name || 'there'}! I'm TaskVibe Assistant, your AI-powered productivity companion! How can I help you organize your tasks today?`);
      }, 500);
    }
  }, [isOpen, user]);

  const addMessage = (sender, message, isTyping = false) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      sender, 
      message, 
      timestamp: new Date(),
      isTyping 
    }]);
  };

  const simulateTyping = (message) => {
    setIsTyping(true);
    addMessage('bot', '', true);
    
    const typingDelay = Math.min(Math.max(message.length * 30, 800), 2000);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage('bot', message);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: userMessage,
        userId: user?.id
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const { message: botResponse, action, taskDetails } = response.data;

      if (action === 'CREATE_TASK' && taskDetails && onAddTask) {
        await onAddTask(taskDetails);
      }

      simulateTyping(botResponse);

    } catch (error) {
      console.error('Chatbot error:', error);
      simulateTyping('🤖 Oops! I\'m experiencing some technical difficulties. Please try again in a moment. I\'m here to help! 🔧');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getQuickActions = () => [
    { label: '➕ Add Task', action: 'create task' },
    { label: '📋 Show Tasks', action: 'show my tasks' },
    { label: '💪 Motivate Me', action: 'motivate me' },
    { label: '💡 Productivity Tip', action: 'give me a tip' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const RobotAvatar = ({ isTyping }) => (
    <Avatar 
      sx={{ 
        bgcolor: '#7c3aed', 
        width: 40, 
        height: 40,
        animation: isTyping ? 'pulse 1.5s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        }
      }}
    >
      <RobotIcon />
    </Avatar>
  );

  const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    const isTypingMessage = message.isTyping;
    
    return (
      <Fade in={true}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isBot ? 'flex-start' : 'flex-end',
            mb: 2,
            alignItems: 'flex-end'
          }}
        >
          {isBot && (
            <Box sx={{ mr: 1 }}>
              <RobotAvatar isTyping={isTypingMessage} />
            </Box>
          )}
          
          <Paper
            elevation={2}
            sx={{
              p: 2,
              maxWidth: '75%',
              bgcolor: isBot ? '#f3f4f6' : '#7c3aed',
              color: isBot ? '#1f2937' : 'white',
              borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              position: 'relative',
              animation: isTypingMessage ? 'typing 1s infinite' : 'none',
              '@keyframes typing': {
                '0%, 60%': { opacity: 0.8 },
                '30%': { opacity: 1 }
              }
            }}
          >
            {isTypingMessage ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  TaskVibe Assistant is {isTyping ? 'typing' : 'ready'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: '#7c3aed',
                        animation: `bounce 1.4s infinite ease-in-out both`,
                        animationDelay: `${(dot - 1) * 0.16}s`,
                        '@keyframes bounce': {
                          '0%, 80%, 100%': { transform: 'scale(0)' },
                          '40%': { transform: 'scale(1)' }
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4,
                  fontSize: '0.95rem'
                }}
              >
                {message.message}
              </Typography>
            )}
          </Paper>
          
          {!isBot && (
            <Avatar
              sx={{
                bgcolor: '#10b981',
                width: 32,
                height: 32,
                ml: 1,
                fontSize: '0.8rem'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          )}
        </Box>
      </Fade>
    );
  };

  if (!isOpen) {
    return (
      <Tooltip title="Chat with TaskVibe Assistant" placement="top">
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            sx={{
              borderRadius: '50%',
              width: 60,
              height: 60,
              minWidth: 'auto',
              bgcolor: '#7c3aed',
              '&:hover': { bgcolor: '#6d28d9' },
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' }
              }
            }}
          >
            <RobotIcon sx={{ fontSize: 28 }} />
          </Button>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        borderRadius: 3,
        overflow: 'hidden',
        border: '2px solid #7c3aed'
      }}
    >
      <Box
        sx={{
          bgcolor: '#7c3aed',
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RobotAvatar isTyping={isTyping} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              TaskVibe Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              AI-Powered Productivity Helper
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {messages.length <= 1 && (
        <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#6b7280', fontWeight: 500 }}>
            Quick Actions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {getQuickActions().map((action, index) => (
              <Chip
                key={index}
                label={action.label}
                onClick={() => handleQuickAction(action.action)}
                size="small"
                sx={{
                  bgcolor: '#e5e7eb',
                  '&:hover': { bgcolor: '#d1d5db' },
                  fontSize: '0.75rem',
                  height: 28
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: '#ffffff',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: '#f1f5f9' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 3 }
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          bgcolor: '#f8fafc',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end'
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Ask me anything about tasks..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          sx={{
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#7c3aed',
            '&:hover': { bgcolor: '#6d28d9' }
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatbot;