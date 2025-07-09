const { NlpManager } = require('node-nlp');
const axios = require('axios');

class TaskVibeAssistant {
    constructor() {
        this.manager = null;
        this.context = {
            lastAction: null,
            waitingForTaskDetails: false,
            pendingTask: null
        };
    }

    async setup() {
        try {
            this.manager = new NlpManager({ languages: ['en'] });
            await this.trainModel();
            console.log('TaskVibe Assistant initialized successfully!');
            return this.manager;
        } catch (error) {
            console.error('Error setting up TaskVibe Assistant:', error);
            throw error;
        }
    }

    async trainModel() {
        const { manager } = this;

        // Greetings
        manager.addDocument('en', 'hello', 'greetings');
        manager.addDocument('en', 'hi', 'greetings');
        manager.addDocument('en', 'hey', 'greetings');
        manager.addDocument('en', 'good morning', 'greetings');
        manager.addDocument('en', 'good afternoon', 'greetings');
        manager.addDocument('en', 'good evening', 'greetings');
        manager.addDocument('en', 'howdy', 'greetings');

        // Task creation
        manager.addDocument('en', 'create task', 'task.create');
        manager.addDocument('en', 'add task', 'task.create');
        manager.addDocument('en', 'new task', 'task.create');
        manager.addDocument('en', 'make task', 'task.create');
        manager.addDocument('en', 'add a task', 'task.create');
        manager.addDocument('en', 'create new task', 'task.create');
        manager.addDocument('en', 'I need to add something', 'task.create');

        // Task management
        manager.addDocument('en', 'show tasks', 'task.list');
        manager.addDocument('en', 'list tasks', 'task.list');
        manager.addDocument('en', 'my tasks', 'task.list');
        manager.addDocument('en', 'view tasks', 'task.list');
        manager.addDocument('en', 'what are my tasks', 'task.list');
        manager.addDocument('en', 'show me my todos', 'task.list');

        // Help and capabilities
        manager.addDocument('en', 'help', 'help');
        manager.addDocument('en', 'what can you do', 'help');
        manager.addDocument('en', 'commands', 'help');
        manager.addDocument('en', 'how do you work', 'help');
        manager.addDocument('en', 'what are your features', 'help');

        // Productivity and motivation
        manager.addDocument('en', 'motivate me', 'motivation');
        manager.addDocument('en', 'I need motivation', 'motivation');
        manager.addDocument('en', 'encourage me', 'motivation');
        manager.addDocument('en', 'I feel lazy', 'motivation');

        // Task completion
        manager.addDocument('en', 'I completed a task', 'task.completed');
        manager.addDocument('en', 'task done', 'task.completed');
        manager.addDocument('en', 'finished task', 'task.completed');

        // Goodbye
        manager.addDocument('en', 'bye', 'goodbye');
        manager.addDocument('en', 'goodbye', 'goodbye');
        manager.addDocument('en', 'see you later', 'goodbye');
        manager.addDocument('en', 'thanks', 'goodbye');
        manager.addDocument('en', 'thank you', 'goodbye');

        // Add varied responses
        manager.addAnswer('en', 'greetings', '🤖 Hello there! I\'m TaskVibe Assistant, your personal productivity companion! How can I help you stay organized today?');
        manager.addAnswer('en', 'greetings', '🤖 Hi! Ready to tackle some tasks? I\'m here to help you stay productive and organized!');
        manager.addAnswer('en', 'greetings', '🤖 Hey! Great to see you! Let\'s make today productive together. What would you like to work on?');

        manager.addAnswer('en', 'task.create', '🤖 Excellent! I love helping with new tasks! Please tell me what you\'d like to add. You can describe it like: "Add a task to call mom with high priority" or just tell me what needs to be done!');
        
        manager.addAnswer('en', 'task.list', '🤖 Your tasks are displayed right above in the main interface! I can see you\'re staying organized. Need help creating a new task or want some productivity tips?');
        
        manager.addAnswer('en', 'help', '🤖 I\'m your TaskVibe Assistant! Here\'s what I can do:\n• Create new tasks for you\n• Provide productivity tips\n• Offer motivation when you need it\n• Help organize your workflow\n• Answer questions about task management\n\nJust tell me what you need!');
        
        manager.addAnswer('en', 'motivation', '🤖 You\'ve got this! 💪 Remember, every big achievement starts with small steps. Each task you complete brings you closer to your goals. Stay focused and keep moving forward!');
        manager.addAnswer('en', 'motivation', '🤖 Don\'t give up! 🌟 Productivity isn\'t about perfection, it\'s about progress. Take it one task at a time, and celebrate your wins along the way!');
        
        manager.addAnswer('en', 'task.completed', '🤖 Awesome work! 🎉 There\'s nothing quite like the satisfaction of completing a task. Keep up the momentum - you\'re doing great!');
        
        manager.addAnswer('en', 'goodbye', '🤖 Goodbye! Keep being productive and remember - I\'m always here when you need help organizing your tasks! 👋');
        manager.addAnswer('en', 'goodbye', '🤖 See you later! Don\'t forget to tackle those tasks. You\'ve got this! 🚀');

        await manager.train();
        manager.save();
    }

    async processMessage(message, userId) {
        try {
            // Handle task creation context
            if (this.context.waitingForTaskDetails) {
                return await this.handleTaskCreation(message, userId);
            }

            const response = await this.manager.process('en', message);
            let reply = response.answer || this.getIntelligentResponse(message);

            // Handle specific intents
            if (response.intent === 'task.create') {
                this.context.waitingForTaskDetails = true;
                this.context.lastAction = 'task.create';
            }

            return {
                message: reply,
                intent: response.intent,
                confidence: response.score,
                context: this.context
            };

        } catch (error) {
            console.error('Error processing message:', error);
            return {
                message: '🤖 Oops! I encountered a small glitch. Could you please try again? I\'m here to help!',
                intent: 'error',
                confidence: 0
            };
        }
    }

    async handleTaskCreation(message, userId) {
        try {
            const taskDetails = this.extractTaskDetails(message);
            
            this.context.waitingForTaskDetails = false;
            this.context.lastAction = null;

            return {
                message: `🤖 Perfect! I've prepared your task "${taskDetails.title}" with ${taskDetails.priority} priority. It should appear in your task list now! Anything else you'd like to add?`,
                intent: 'task.created',
                confidence: 1.0,
                taskDetails: taskDetails,
                action: 'CREATE_TASK'
            };

        } catch (error) {
            console.error('Error creating task:', error);
            this.context.waitingForTaskDetails = false;
            return {
                message: '🤖 I had trouble processing that task. Could you try describing it again? For example: "Buy groceries with high priority"',
                intent: 'task.create.error',
                confidence: 0.5
            };
        }
    }

    extractTaskDetails(message) {
        const priorityKeywords = {
            'high': ['urgent', 'important', 'asap', 'critical', 'high', 'priority'],
            'low': ['later', 'low', 'whenever', 'someday', 'minor'],
            'medium': ['normal', 'medium', 'regular']
        };

        let priority = 'medium';
        let title = message.trim();
        let description = '';

        // Extract priority
        for (const [level, keywords] of Object.entries(priorityKeywords)) {
            if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
                priority = level;
                break;
            }
        }

        // Clean up title (remove priority indicators)
        title = title.replace(/\b(high|low|medium|urgent|important|priority|asap|critical|later|whenever|someday|minor|normal|regular)\b/gi, '').trim();
        
        // Remove common task creation phrases
        title = title.replace(/^(add a task to|create a task to|add task to|make a task to|add|create|make)\s*/gi, '').trim();

        // If title is too long, split into title and description
        if (title.length > 50) {
            const words = title.split(' ');
            title = words.slice(0, 8).join(' ');
            description = words.slice(8).join(' ');
        }

        return {
            title: title || 'New Task',
            description: description,
            priority: priority
        };
    }

    getIntelligentResponse(message) {
        const responses = [
            "🤖 That's interesting! I'm here to help with your tasks and productivity. What would you like to work on?",
            "🤖 I understand! While I specialize in task management, I'm always learning. How can I help you stay organized today?",
            "🤖 Great question! I'm focused on helping you be more productive. Want to create a new task or need some motivation?",
            "🤖 I appreciate you sharing that! Let's channel that energy into getting things done. What's on your task list today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getProductivityTip() {
        const tips = [
            "💡 Pro tip: Break large tasks into smaller, manageable chunks!",
            "💡 Try the 2-minute rule: If it takes less than 2 minutes, do it now!",
            "💡 Prioritize your tasks: High impact + Low effort = Quick wins!",
            "💡 Take regular breaks to maintain focus and energy!",
            "💡 Celebrate small victories - they add up to big achievements!"
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
}

// Initialize and export
async function setupChatbot() {
    const assistant = new TaskVibeAssistant();
    await assistant.setup();
    return assistant;
}

module.exports = { setupChatbot, TaskVibeAssistant };