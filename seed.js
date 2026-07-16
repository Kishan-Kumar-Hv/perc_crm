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
    assignedBatches: ['B-CBSE10', 'B-ICSE10', 'B-CL9', 'B-CL8', 'B-CL67'],
    password: '9876543210'
  }
];

const batches = [
  { id: 'B-CBSE10', name: 'CBSE - 10', courseName: 'CBSE Class 10 Board Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' },
  { id: 'B-ICSE10', name: 'ICSE - 10', courseName: 'ICSE Class 10 Board Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' },
  { id: 'B-CL9', name: 'Class 9', courseName: 'Class 9 Foundation Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' },
  { id: 'B-CL8', name: 'Class 8', courseName: 'Class 8 Foundation Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' },
  { id: 'B-CL67', name: 'Class 6-7', courseName: 'Junior Science Prep', timing: '03:00 PM - 08:00 PM', teacherId: 'T-2026-0001' }
];

const rawStudentsCBSE10 = [
  { name: 'Joel', parentContact: '8668394644', parentName: 'Sundari S', parentEmail: 'sundariasha925@gmail.com' },
  { name: 'Vaishnavi', parentContact: '9886458974', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com' },
  { name: 'Purochana', parentContact: '9845982410', parentName: 'Roopa A', parentEmail: 'roopaa2024@gmail.com' },
  { name: 'Thejas', parentContact: '9945505511', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Chirag', parentContact: '9945741087', parentName: 'Jayasheela B N', parentEmail: 'jayasheelab9@gmail.com' },
  { name: 'Sanjana', parentContact: '7259601010', parentName: 'Santosh Bonageri', parentEmail: 'santosh.hb@gmail.com' },
  { name: 'Akshath', parentContact: '8722491679', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Asmit', parentContact: '9902000499', parentName: 'Kailash Chandra Sahu', parentEmail: 'kailashsahu125@gmail.com' },
  { name: 'Vibha', parentContact: '9916940601', parentName: 'Jayalaxmi Ullour', parentEmail: 'jayalaxmi_ullour@yahoo.co.in' },
  { name: 'Sagar', parentContact: '9148792344', parentName: 'Deepa R D', parentEmail: 'ddeepard@gmail.com' },
  { name: 'Vishnu', parentContact: '9886458974', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com' },
  { name: 'Nischitha', parentContact: '9902230580', parentName: 'Nandini Praveen D', parentEmail: 'nandini.cma@gmail.com' },
  { name: 'Hindu', parentContact: '9901508029', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Atiksh', parentContact: '8197078792', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Gowthami', parentContact: '9741661726', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Vaishwik', parentContact: '8618386353', parentName: 'Komal P Agarwal', parentEmail: 'komalagarwal0282@gmail.com' }
];

const rawStudentsICSE10 = [
  { name: 'Shivani', parentContact: '6362790208', parentName: 'Ambika', parentEmail: 'NA' },
  { name: 'Ritvik', parentContact: '9739095911', parentName: 'Mini Mohan', parentEmail: 'minmohan1985@gmail.com' },
  { name: 'Kiran', parentContact: '8088172150', parentName: 'Smitha Mole', parentEmail: 'mitamole@gmail.com' },
  { name: 'Akshara', parentContact: '9980255867', parentName: 'Raghudas', parentEmail: 'raghudaspanicker7@gmail.com' },
  { name: 'Kavinaya', parentContact: '9731952072', parentName: 'Manikandan R', parentEmail: 'manirajv06@gmail.com' },
  { name: 'Divi', parentContact: '8105453200', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Ishaan', parentContact: '9901434572', parentName: 'Mousumi Roy', parentEmail: 'mousumucroy@gmail.com' },
  { name: 'Hrithika', parentContact: '9481424675', parentName: 'Dr I B Hiremath', parentEmail: 'yogesh.bhiremath@gmail.com' },
  { name: 'Ryan', parentContact: '8105077994', parentName: 'Smrithi Jacob', parentEmail: 'NA' },
  { name: 'Nayan', parentContact: '9986975368', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Navneeth', parentContact: '6363058537', parentName: 'Naveen K Puram', parentEmail: 'naveen.puram@yahoo.com' },
  { name: 'Taarunya', parentContact: '9739891287', parentName: 'Kusuma S', parentEmail: 'kusuma.srinivasa@gmail.com' },
  { name: 'Darshini', parentContact: '9916116908', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Satakshi', parentContact: '9901115200', parentName: 'Sohandeep Dhar', parentEmail: 'sohandeep.dhar@gmail.com' }
];

const rawStudentsCL9 = [
  { name: 'Rishabh', parentContact: '9972230647', parentName: 'Bhuvana Mane', parentEmail: 'bhuna2707@gmail.com' },
  { name: 'Darshan', parentContact: '7975079659', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Nischitha', parentContact: '9886990081', parentName: 'Krishna Kumar K P', parentEmail: 'kkothega@gmail.com' },
  { name: 'Neeriksha', parentContact: '9886990081', parentName: 'Krishna Kumar K P', parentEmail: 'kkothega@gmail.com' },
  { name: 'Laasya', parentContact: '9886476679', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Ananya', parentContact: '8971334433', parentName: 'Ashok Kumar', parentEmail: 'cherukuriashokkumar@gmail.com' },
  { name: 'Gautham', parentContact: '8088154411', parentName: 'Gopi I', parentEmail: 'igopi.hal@gmail.com' },
  { name: 'Dhairya', parentContact: '9019163188', parentName: 'Iti Sachan', parentEmail: 'iti.sachan@yahoo.com' },
  { name: 'Chethan', parentContact: '9739891287', parentName: 'Kusuma S', parentEmail: 'kusuma.srinivasa@gmail.com' },
  { name: 'Aleena Juno', parentContact: '6282613114', parentName: 'Juno John', parentEmail: 'ponnyjuno@gmail.com' },
  { name: 'Varun', parentContact: '9036415661', parentName: 'Mahesh', parentEmail: 'vijaysurya2112@gmail.com' },
  { name: 'Maanvi', parentContact: '8123120151', parentName: 'Deepa G J', parentEmail: 'deepagj01@gmail.com' },
  { name: 'Aarush', parentContact: '9980092375', parentName: 'Raj Prakash', parentEmail: 'r_rajprakash@yahoo.com' },
  { name: 'Aaryan', parentContact: '9980663100', parentName: 'Gloria Jasmine', parentEmail: 'gloriajas.gj@gmail.com' },
  { name: 'Navya', parentContact: '8470088215', parentName: 'Kislay Navin', parentEmail: 'kislay.navin@gmail.com' },
  { name: 'Anwiti', parentContact: '9886657742', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Poorvi', parentContact: '9902829979', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Sukhodeep', parentContact: '9742720391', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Pratyuksha', parentContact: '7619379396', parentName: 'Ashwini Suresh', parentEmail: 'ashusuri23@gmail.com' }
];

const rawStudentsCL8 = [
  { name: 'Revin', parentContact: '8105077994', parentName: 'Smrithi Jacob', parentEmail: 'NA' },
  { name: 'Mukundan', parentContact: '8296531869', parentName: 'Raja Manickam', parentEmail: 'raja.4ur@gmail.com' },
  { name: 'Harnish', parentContact: '9739972367', parentName: 'Deepa', parentEmail: 'deepadinesh4@gmail.com' },
  { name: 'Maahi', parentContact: '9980064914', parentName: 'Sukesh Kumar', parentEmail: 'sukesh.rna@gmail.com' },
  { name: 'Isa', parentContact: '8867848195', parentName: 'Renu Zachariah', parentEmail: 'renumzachariah@gmail.com' },
  { name: 'Lishan', parentContact: '9845852466', parentName: 'Gurushankar K', parentEmail: 'gurushankar.k@gmail.com' },
  { name: 'Priyanshu', parentContact: '9886904951', parentName: 'Mukesh Kumar', parentEmail: 'mukesh.aug2012@gmail.com' },
  { name: 'Lakshika', parentContact: '9590504696', parentName: 'Gopinath V', parentEmail: 'gopinathvgr@gmail.com' },
  { name: 'Nesara', parentContact: '9901290301', parentName: 'Harish C M', parentEmail: 'harishcm81@gmail.com' },
  { name: 'Anshul', parentContact: '6363791260', parentName: 'Bindyachal Choubey', parentEmail: 'manisha.ranjan87@gmail.com' },
  { name: 'Shreeram', parentContact: '9361966698', parentName: 'Sivasankar V', parentEmail: 'wsivasankar@gmail.com' },
  { name: 'Adithi', parentContact: '9900919615', parentName: 'B Manju Pallavi', parentEmail: 'bmanjupallavi@gmail.com' },
  { name: 'Kishan', parentContact: '9080765043', parentName: 'Kalaivani K', parentEmail: 'kellykalai826@gmail.com' },
  { name: 'Vikas', parentContact: '8123561992', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Jhanavi', parentContact: '9980992406', parentName: 'Kalaivani G', parentEmail: 'kalaivanijhanu@gmail.com' },
  { name: 'Jaikavish', parentContact: '8971765156', parentName: 'NA', parentEmail: 'NA' }
];

const rawStudentsCL67 = [
  { name: 'Madhvik', parentContact: '7090766040', parentName: 'Prabhakar', parentEmail: 'prabhakar.ramaswamy@gmail.com' },
  { name: 'Ravin', parentContact: '8088172150', parentName: 'Smitha Mole', parentEmail: 'mitamole@gmail.com' },
  { name: 'Japheth', parentContact: '8668394644', parentName: 'Sundari S', parentEmail: 'sundariasha925@gmail.com' },
  { name: 'Tharun', parentContact: '9620360964', parentName: 'Amudha M', parentEmail: 'amuda.mukundan@gmail.com' },
  { name: 'Tanishi', parentContact: '8884500488', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Thanush', parentContact: '8971334433', parentName: 'Ashok Kumar', parentEmail: 'cherukuriashokkumar@gmail.com' },
  { name: 'Aditi', parentContact: '6362790208', parentName: 'Ambika', parentEmail: 'NA' },
  { name: 'Sarah', parentContact: '8867848195', parentName: 'Renu Zachariah', parentEmail: 'renumzachariah@gmail.com' },
  { name: 'Angelina', parentContact: '9972169851', parentName: 'Jesly P J', parentEmail: 'jesjames.pj@gmail.com' },
  { name: 'Jignesh', parentContact: '8880222409', parentName: 'Bijaya Mohapatra', parentEmail: 'bijayamohapatra@gmail.com' },
  { name: 'Suhani', parentContact: '7259692548', parentName: 'NA', parentEmail: 'NA' },
  { name: 'Mohan', parentContact: '8123120151', parentName: 'Deepa G J', parentEmail: 'deepagj01@gmail.com' }
];

const students = [];

const formatBatchStudents = (rawList, batchId, className, prefix, baseFees) => {
  rawList.forEach((st, idx) => {
    // Generate incremental unique IDs
    const id = `${prefix}-2026-${String(idx + 1).padStart(3, '0')}`;
    
    // Distribute feesPaid realistically: 
    // index % 3 === 0 -> Unpaid (0)
    // index % 3 === 1 -> Paid (baseFees)
    // index % 3 === 2 -> Partial (baseFees / 2)
    let feesPaid = 0;
    if (idx % 3 === 1) {
      feesPaid = baseFees;
    } else if (idx % 3 === 2) {
      feesPaid = Math.round(baseFees / 2);
    }
    
    students.push({
      id,
      name: st.name,
      parentName: st.parentName || 'NA',
      parentContact: st.parentContact || 'NA',
      parentEmail: st.parentEmail || 'NA',
      className,
      courseEnrolled: batches.find(b => b.id === batchId).courseName,
      batchId,
      admissionDate: '2025-09-01',
      totalFees: baseFees,
      feesPaid,
      password: st.parentContact || '123456'
    });
  });
};

formatBatchStudents(rawStudentsCBSE10, 'B-CBSE10', 'CBSE - 10', 'CBSE10', 6000);
formatBatchStudents(rawStudentsICSE10, 'B-ICSE10', 'ICSE - 10', 'ICSE10', 6000);
formatBatchStudents(rawStudentsCL9, 'B-CL9', 'Class 9', 'CL9', 5500);
formatBatchStudents(rawStudentsCL8, 'B-CL8', 'Class 8', 'CL8', 5000);
formatBatchStudents(rawStudentsCL67, 'B-CL67', 'Class 6-7', 'CL67', 4500);

const defaultAnnouncements = [
  {
    id: 'AN-2001',
    type: 'Circular',
    title: 'PTM Parent Teacher Meet',
    date: '2026-07-12',
    content: 'Discussion items: mock progression reports and ranker feedback.'
  }
];

// Initial mock attendance mapping for each batch to make chart populate beautifully on first run
const defaultAttendance = {
  'B-CBSE10_2026-07-01': { 'CBSE10-2026-001': 'Present', 'CBSE10-2026-002': 'Present', 'CBSE10-2026-003': 'Absent' },
  'B-ICSE10_2026-07-01': { 'ICSE10-2026-001': 'Present', 'ICSE10-2026-002': 'Absent' },
  'B-CBSE10_2026-07-02': { 'CBSE10-2026-001': 'Present', 'CBSE10-2026-002': 'Present', 'CBSE10-2026-003': 'Present' },
  'B-ICSE10_2026-07-02': { 'ICSE10-2026-001': 'Present', 'ICSE10-2026-002': 'Present' },
  'B-CBSE10_2026-07-03': { 'CBSE10-2026-001': 'Present', 'CBSE10-2026-002': 'Absent', 'CBSE10-2026-003': 'Present' }
};

const defaultGrades = [
  {
    id: 'GR-3001',
    studentId: 'CBSE10-2026-001',
    batchId: 'B-CBSE10',
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
    batchId: 'B-CBSE10',
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
