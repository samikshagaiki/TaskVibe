const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { TaskVibeAssistant } = require('../chatbot/nlp');

// Initialize chatbot instance
let chatbotInstance = null;

// Initialize chatbot on server start
const initializeChatbot = async () => {
  try {
    if (!chatbotInstance) {
      chatbotInstance = new TaskVibeAssistant();
      await chatbotInstance.setup();
      console.log('Chatbot initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize chatbot:', error);
  }
};

// Call initialization
initializeChatbot();

// Handle chatbot messages
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        message: '🤖 I didn\'t catch that! Could you please send me a message?',
        intent: 'empty_message'
      });
    }

    // Ensure chatbot is initialized
    if (!chatbotInstance) {
      await initializeChatbot();
    }

    // Process the message
    const response = await chatbotInstance.processMessage(message, userId);
    
    // Add some personality and context
    let enhancedResponse = response.message;
    
    // Add contextual responses based on confidence
    if (response.confidence < 0.5) {
      enhancedResponse += "\n\n💡 I'm still learning! If you need help with tasks, try asking me to 'create a task' or 'show my tasks'.";
    }

    res.json({
      message: enhancedResponse,
      intent: response.intent,
      confidence: response.confidence,
      action: response.action,
      taskDetails: response.taskDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      message: '🤖 I\'m experiencing some technical difficulties right now. Please try again in a moment! I\'m here to help you with your tasks. 🔧',
      intent: 'error',
      confidence: 0,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chatbot status and capabilities
router.get('/status', auth, async (req, res) => {
  try {
    const isReady = chatbotInstance !== null;
    
    res.json({
      status: isReady ? 'ready' : 'initializing',
      capabilities: [
        'Task Creation',
        'Task Management Advice',
        'Productivity Tips',
        'Motivational Support',
        'Natural Language Processing'
      ],
      version: '2.0.0',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Unable to get chatbot status'
    });
  }
});

// Get productivity tip
router.get('/tip', auth, async (req, res) => {
  try {
    if (!chatbotInstance) {
      await initializeChatbot();
    }

    const tip = chatbotInstance.getProductivityTip();
    
    res.json({
      message: `🤖 ${tip}`,
      type: 'productivity_tip',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Productivity tip error:', error);
    res.status(500).json({
      message: '🤖 I couldn\'t fetch a tip right now, but here\'s one: Take breaks to stay productive! 💪',
      type: 'fallback_tip'
    });
  }
});

// Reset chatbot context (useful for debugging)
router.post('/reset', auth, async (req, res) => {
  try {
    if (chatbotInstance) {
      chatbotInstance.context = {
        lastAction: null,
        waitingForTaskDetails: false,
        pendingTask: null
      };
    }

    res.json({
      message: '🤖 My memory has been refreshed! I\'m ready to help you with your tasks.',
      status: 'context_reset',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot reset error:', error);
    res.status(500).json({
      message: '🤖 I had trouble resetting. But I\'m still here to help!',
      status: 'reset_error'
    });
  }
});

module.exports = router;