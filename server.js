import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

    app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
  app.use(express.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected to portfolio-contact database'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true }
}, { timestamps: true });

// Create model (will use "contacts" collection automatically)
const Contact = mongoose.model('Contact', contactSchema);

// API endpoint to save contact form data
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: '✅ Message saved successfully' });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('📡 Portfolio backend is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});













