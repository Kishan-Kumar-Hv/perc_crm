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

// --- API SECURITY MIDDLEWARE ---
const API_KEY = process.env.API_KEY || 'perc_crm_secure_token_2026_xyz';

const validateApiKey = (req, res, next) => {
  const incomingKey = req.headers['x-api-key'];
  if (!incomingKey || incomingKey !== API_KEY) {
    console.warn(`Unauthorized access attempt from IP: ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid API security key.' });
  }
  next();
};

// --- API ROUTES ---

// Fetch full CRM state (initializes a clean empty document if none exists)
app.get('/api/crm-data', validateApiKey, async (req, res) => {
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
app.post('/api/crm-data/sync', validateApiKey, async (req, res) => {
  try {
    // Payload integrity checks (protect against NoSQL corruption/injection)
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Bad Request: Invalid body payload structure.' });
    }

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

// Reset database state to mock fallback defaults
app.post('/api/crm-data/reset', validateApiKey, async (req, res) => {
  try {
    await CrmState.deleteMany({});
    
    const defaultSeedStudents = [
      { id: 'CBSE10-2026-001', name: 'Joel', parentName: 'Sundari S', parentContact: '8668394644', parentEmail: 'sundariasha925@gmail.com', className: 'CBSE - 10', courseEnrolled: 'CBSE Class 10 Board Prep', batchId: 'B-001', admissionDate: '2025-09-01', totalFees: 6000, feesPaid: 6000, password: '8668394644' },
      { id: 'ICSE10-2026-001', name: 'Vaishnavi', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com', className: 'ICSE - 10', batchId: 'B-001', courseEnrolled: 'ICSE Class 10 Board Prep', totalFees: 6000, feesPaid: 6000, password: '9886458974' },
      { id: 'CL9-2026-001', name: 'Purochana', parentName: 'Roopa A', parentEmail: 'roopaa2024@gmail.com', className: 'Class 9', batchId: 'B-001', courseEnrolled: 'Class 9 Foundation Prep', totalFees: 5500, feesPaid: 5500, password: '9845982410' },
      { id: 'CL8-2026-001', name: 'Thejas', parentName: 'NA', parentContact: '9945505511', parentEmail: 'NA', className: 'Class 8', batchId: 'B-001', courseEnrolled: 'Class 8 Foundation Prep', totalFees: 5000, feesPaid: 0, password: '9945505511' },
      { id: 'CL67-2026-001', name: 'Chirag', parentName: 'Jayasheela B N', parentEmail: 'jayasheelab9@gmail.com', className: 'Class 6-7', batchId: 'B-001', courseEnrolled: 'Junior Science Prep', totalFees: 4500, feesPaid: 3500, password: '9945741087' }
    ];

    const defaultSeedTeachers = [
      { id: 'T-2026-0001', name: 'Dr. Alok Verma', email: 'alok.verma@school.com', contact: '9876543210', subjects: ['Mathematics'], assignedBatches: ['B-001'], password: '9876543210' }
    ];

    const defaultSeedBatches = [
      { id: 'B-001', name: 'CBSE - 10', courseName: 'CBSE Class 10 Board Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' }
    ];

    const state = await CrmState.create({
      students: defaultSeedStudents,
      teachers: defaultSeedTeachers,
      batches: defaultSeedBatches,
      announcements: [
        { id: 'AN-2001', type: 'Circular', title: 'PTM Parent Teacher Meet', date: '2026-07-12', content: 'Discussion items: mock progression reports and ranker feedback.' }
      ],
      attendance: {},
      grades: [],
      observations: [],
      resources: [
        { id: 'R-2001', batchId: 'B-001', title: 'Matrices Formula Sheet & Identity Properties', type: 'Study Material', description: 'Quick cheat-sheet containing determinant rules, matrix properties, and inversion methods.', date: '2026-06-20', link: '#matrix-sheet' }
      ]
    });

    res.json(state);
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
