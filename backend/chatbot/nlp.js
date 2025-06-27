import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

class TaskVibeAssistant {
    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY || (dotenv.parsed && dotenv.parsed.OPENAI_API_KEY),
        });
        this.openai = new OpenAIApi(this.configuration);
        this.context = {
            lastAction: null,
            waitingForTaskDetails: false,
            pendingTask: null
        };
        this.conversationHistory = [];
    }

    async setup() {
        try {
            console.log('TaskVibe Assistant with OpenAI API initialized successfully!');
            return this;
        } catch (error) {
            console.error('Error setting up TaskVibe Assistant:', error);
            throw error;
        }
    }

    async processMessage(message, userId) {
        try {
            // Handle task creation context
            if (this.context.waitingForTaskDetails) {
                return await this.handleTaskCreation(message, userId);
            }

            // Prepare the conversation context for OpenAI
            const systemPrompt = `
                You are TaskVibe Assistant, a friendly and productive task management assistant. Your role is to help users create and manage tasks, provide motivational responses, and offer productivity tips. Use a conversational tone with emojis (🤖, 💪, 🎉, etc.) to keep interactions engaging. 

                Supported intents:
                - Greetings: Respond with a welcoming message (e.g., "Hello! Ready to tackle tasks? 🤖").
                - Task creation: Prompt for task details (e.g., "Tell me about the task you'd like to add! 😊").
                - Task list: Inform user tasks are displayed in the interface (e.g., "Your tasks are shown above! Need help?").
                - Motivation: Provide encouraging words (e.g., "You've got this! Keep pushing forward! 💪").
                - Task completed: Celebrate completion (e.g., "Awesome job! 🎉 What's next?").
                - Goodbye: Bid farewell (e.g., "See you later! Stay productive! 👋").
                - Help: List capabilities (e.g., "I can create tasks, give tips, and motivate you!").
                - Default: Respond helpfully and suggest task-related actions.

                If the user provides task details, set waitingForTaskDetails to true and handle it in the next message. Detect task priority (high, medium, low) based on keywords like "urgent," "important," or "later." Keep responses concise and action-oriented.
            `;

            // Append the new message to conversation history
            this.conversationHistory.push({ role: 'user', content: message });

            // Limit conversation history to avoid token limits (e.g., last 10 messages)
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            // Call OpenAI API
            const completion = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo', // You can use 'gpt-4' if available
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...this.conversationHistory,
                ],
                max_tokens: 200,
                temperature: 0.7,
            });

            const response = completion.data.choices[0].message.content;
            let intent = this.detectIntent(response, message);

            // Update conversation history
            this.conversationHistory.push({ role: 'assistant', content: response });

            // Handle task creation intent
            if (intent === 'task.create') {
                this.context.waitingForTaskDetails = true;
                this.context.lastAction = 'task.create';
            }

            return {
                message: response,
                intent: intent,
                confidence: 0.9, // OpenAI doesn't provide confidence scores, so we use a default
                context: this.context
            };

        } catch (error) {
            console.error('Error processing message with OpenAI:', error);
            return {
                message: '🤖 Oops! I hit a snag. Could you try again? I’m here to help with your tasks! 🔧',
                intent: 'error',
                confidence: 0
            };
        }
    }

    async handleTaskCreation(message) {
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

    detectIntent(response, message) {
        // Simple intent detection based on response and message content
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'greetings';
        } else if (lowerMessage.includes('task') && (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new'))) {
            return 'task.create';
        } else if (lowerMessage.includes('task') && (lowerMessage.includes('list') || lowerMessage.includes('show') || lowerMessage.includes('view'))) {
            return 'task.list';
        } else if (lowerMessage.includes('motivate') || lowerMessage.includes('encourage') || lowerMessage.includes('lazy')) {
            return 'motivation';
        } else if (lowerMessage.includes('completed') || lowerMessage.includes('done') || lowerMessage.includes('finished')) {
            return 'task.completed';
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('thanks')) {
            return 'goodbye';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('commands')) {
            return 'help';
        } else {
            return 'default';
        }
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
export { setupChatbot, TaskVibeAssistant };