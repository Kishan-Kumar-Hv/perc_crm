import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_perc';

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

const teachers = [
  {
    id: 'T-2026-0001',
    name: 'Dr. Alok Verma',
    email: 'alok.verma@school.com',
    contact: '9876543210',
    subjects: ['Mathematics'],
    assignedBatches: ['B-001'],
    password: '9876543210' // Default password set to phone number
  }
];

const batches = [
  {
    id: 'B-001',
    name: 'CBSE - 10',
    courseName: 'CBSE Class 10 Board Prep',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0001'
  }
];

const getClassPrefix = (className) => {
  const normalized = className.toUpperCase().replace(/\s+/g, '');
  if (normalized.includes('CBSE-10') || normalized.includes('CBSE10')) return 'CBSE10';
  if (normalized.includes('ICSE-10') || normalized.includes('ICSE10')) return 'ICSE10';
  if (normalized.includes('CLASS9') || normalized.includes('GRADE9')) return 'CL9';
  if (normalized.includes('CLASS8') || normalized.includes('GRADE8')) return 'CL8';
  if (normalized.includes('CLASS6-7') || normalized.includes('CLASS67')) return 'CL67';
  return 'REG';
};

const rawStudents = [
  { name: 'Joel', parentContact: '8668394644', parentName: 'Sundari S', parentEmail: 'sundariasha925@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', totalFees: 6000, feesPaid: 6000, password: '8668394644' },
  { name: 'Vaishnavi', parentContact: '9886458974', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com', className: 'ICSE - 10', batchId: 'B-001', courseEnrolled: 'ICSE Class 10 Board Prep', totalFees: 6000, feesPaid: 6000, password: '9886458974' },
  { name: 'Purochana', parentContact: '9845982410', parentName: 'Roopa A', parentEmail: 'roopaa2024@gmail.com', className: 'Class 9', batchId: 'B-001', courseEnrolled: 'Class 9 Foundation Prep', totalFees: 5500, feesPaid: 5500, password: '9845982410' },
  { name: 'Thejas', parentContact: '9945505511', parentName: 'NA', parentEmail: 'NA', className: 'Class 8', batchId: 'B-001', courseEnrolled: 'Class 8 Foundation Prep', totalFees: 5000, feesPaid: 0, password: '9945505511' },
  { name: 'Chirag', parentContact: '9945741087', parentName: 'Jayasheela B N', parentEmail: 'jayasheelab9@gmail.com', className: 'Class 6-7', batchId: 'B-001', courseEnrolled: 'Junior Science Prep', totalFees: 4500, feesPaid: 3500, password: '9945741087' }
];

// Format students to match our registry pattern
const students = rawStudents.map((st) => {
  const prefix = getClassPrefix(st.className);
  return {
    id: `${prefix}-2026-001`,
    name: st.name,
    parentName: st.parentName || 'NA',
    parentContact: st.parentContact || 'NA',
    parentEmail: st.parentEmail || 'NA',
    className: st.className,
    courseEnrolled: st.courseEnrolled,
    batchId: st.batchId,
    admissionDate: '2025-09-01',
    totalFees: st.totalFees,
    feesPaid: st.feesPaid,
    password: st.password
  };
});

const defaultAnnouncements = [
  {
    id: 'AN-2001',
    type: 'Circular',
    title: 'PTM Parent Teacher Meet',
    date: '2026-07-12',
    content: 'Discussion items: mock progression reports and ranker feedback.'
  }
];

const defaultAttendance = {
  'B-001_2026-07-01': { 'CBSE10-2026-001': 'Present' }
};

const defaultGrades = [
  {
    id: 'GR-3001',
    studentId: 'CBSE10-2026-001',
    batchId: 'B-001',
    subject: 'Mathematics',
    examName: 'Chapter 1: Matrices',
    score: 92,
    maxScore: 100,
    date: '2026-06-25',
    feedback: 'Excellent matrix algebra calculation skills.'
  }
];

const defaultObservations = [
  {
    id: 'OB-4001',
    studentId: 'CBSE10-2026-001',
    teacherName: 'Dr. Alok Verma',
    feedback: 'Joel is highly proactive in class discussions.',
    date: '2026-07-01'
  }
];

const defaultResources = [
  {
    id: 'RS-5001',
    batchId: 'B-001',
    title: 'Matrices Formula Sheet & Identity Properties',
    type: 'Study Material',
    description: 'Quick cheat-sheet containing determinant rules, matrix properties, and inversion methods.',
    date: '2026-06-20',
    link: '#matrix-sheet'
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas!');

    // Clear existing unified document
    await CrmState.deleteMany({});
    console.log('Cleared existing CRM state database entries.');

    // Create fresh unified record
    const state = new CrmState({
      students,
      teachers,
      batches,
      announcements: defaultAnnouncements,
      attendance: defaultAttendance,
      grades: defaultGrades,
      observations: defaultObservations,
      resources: defaultResources,
      lastUpdated: new Date()
    });

    await state.save();
    console.log(`Successfully seeded CRM state with ${students.length} students, ${teachers.length} teachers, and ${batches.length} batches!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
