const express = require('express');
const auth = require('../middleware/auth.js');
const { TaskVibeAssistant } = require('../chatbot/nlp.js');
const process = require('process');

const router = express.Router();

// Initialize chatbot instance
let chatbotInstance = null;

// Initialize chatbot on server start
const initializeChatbot = async () => {
    try {
        if (!chatbotInstance) {
            const chatbotModule = require('../chatbot/nlp.js');
            chatbotInstance = await chatbotModule.setupChatbot();
            console.log('Chatbot initialized successfully with OpenAI API');
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

        if (!chatbotInstance) {
            await initializeChatbot();
        }

        const response = await chatbotInstance.processMessage(message, userId);
        let enhancedResponse = response.message;

        if (response.confidence < 0.7) {
            enhancedResponse += "\n\n💡 Not sure if I got that right! Try asking me to 'create a task' or 'give me a productivity tip'.";
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
            error: (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ? error.message : undefined
        });
    }
});

// Get chatbot status
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
                'Advanced Natural Language Understanding'
            ],
            version: '2.1.0',
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

// Reset chatbot context
router.post('/reset', auth, async (req, res) => {
    try {
        if (chatbotInstance) {
            chatbotInstance.context = {
                lastAction: null,
                waitingForTaskDetails: false,
                pendingTask: null
            };
            chatbotInstance.conversationHistory = [];
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

// Export the router
module.exports = router;
