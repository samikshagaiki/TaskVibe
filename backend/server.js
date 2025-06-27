const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const chatbotRoutes = require('./routes/chatbot');
const { setupChatbot } = require('./chatbot/nlp');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'Server running', database: dbStatus });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Chatbot setup
let nlp;
setupChatbot().then(nlpInstance => {
    nlp = nlpInstance;
    console.log('Chatbot initialized successfully');
}).catch(err => {
    console.error('Chatbot initialization error:', err);
});

app.post('/api/chatbot', async (req, res) => {
    try {
        if (!nlp) {
            return res.status(503).json({reply: 'Chatbot service is not available'});
        }
        const { message } = req.body;
        const response = await nlp.process('en', message);
        res.json({reply: response.answer || `Sorry, I didn't understand that`});
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({reply: 'Sorry, there was an error processing your message'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));