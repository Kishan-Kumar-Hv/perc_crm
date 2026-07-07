import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_perc';

console.log('Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Falling back to local simulation mode. Running without live database.');
  });

// Schema definition for unified CRM State
const crmStateSchema = new mongoose.Schema({
  students: { type: Array, default: [] },
  teachers: { type: Array, default: [] },
  batches: { type: Array, default: [] },
  announcements: { type: Array, default: [] },
  attendance: { type: mongoose.Schema.Types.Mixed, default: {} },
  grades: { type: Array, default: [] },
  observations: { type: Array, default: [] },
  resources: { type: Array, default: [] },
  lastUpdated: { type: Date, default: Date.now }
});

const CrmState = mongoose.model('CrmState', crmStateSchema);

// --- API ROUTES ---

// Fetch full CRM state (initializes a clean empty document if none exists)
app.get('/api/crm-data', async (req, res) => {
  try {
    let state = await CrmState.findOne();
    if (!state) {
      console.log('Initializing empty CRM state document in MongoDB Atlas...');
      state = await CrmState.create({
        students: [],
        teachers: [],
        batches: [],
        announcements: [],
        attendance: {},
        grades: [],
        observations: [],
        resources: []
      });
    }
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Synchronize state with Mongo Atlas
app.post('/api/crm-data/sync', async (req, res) => {
  try {
    const { students, teachers, batches, announcements, attendance, grades, observations, resources } = req.body;
    let state = await CrmState.findOne();
    
    if (!state) {
      state = new CrmState();
    }
    
    state.students = students || state.students;
    state.teachers = teachers || state.teachers;
    state.batches = batches || state.batches;
    state.announcements = announcements || state.announcements;
    state.attendance = attendance || state.attendance;
    state.grades = grades || state.grades;
    state.observations = observations || state.observations;
    state.resources = resources || state.resources;
    state.lastUpdated = new Date();

    await state.save();
    res.json({ message: 'CRM data sync successful', lastUpdated: state.lastUpdated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server locally if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Express Backend Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
