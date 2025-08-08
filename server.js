import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Warn if important env variables are missing
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in your .env file");
  process.exit(1); // Stop the server
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected to portfolio-contact database'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const contactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  subject: { type: String },
  message: { type: String }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

app.post('/api/contact', async (req, res) => {
  console.log(req.body);
  try {
    const contact = new Contact(req.body);
    await contact.save();
    console.log("✅ Message saved successfully");
    res.status(201).json({ message: '✅ Message saved successfully' });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send(`📡 Portfolio backend is running on port ${PORT}...`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
