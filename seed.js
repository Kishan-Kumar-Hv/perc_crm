import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_perc';

// Re-use the schema format from server.js
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
    assignedBatches: ['B-001']
  },
  {
    id: 'T-2026-0002',
    name: 'Mrs. Deepa Sharma',
    email: 'deepa.sharma@school.com',
    contact: '9876543211',
    subjects: ['Science'],
    assignedBatches: ['B-002']
  },
  {
    id: 'T-2026-0003',
    name: 'Mr. Rajesh Mehta',
    email: 'rajesh.mehta@school.com',
    contact: '9876543212',
    subjects: ['English'],
    assignedBatches: ['B-003']
  },
  {
    id: 'T-2026-0004',
    name: 'Ms. Sneha Rao',
    email: 'sneha.rao@school.com',
    contact: '9876543213',
    subjects: ['Social Studies'],
    assignedBatches: ['B-004']
  },
  {
    id: 'T-2026-0005',
    name: 'Mrs. Lakshmi Priya',
    email: 'lakshmi.priya@school.com',
    contact: '9876543214',
    subjects: ['General Science'],
    assignedBatches: ['B-005']
  }
];

const batches = [
  {
    id: 'B-001',
    name: 'CBSE - 10',
    courseName: 'CBSE Class 10 Board Prep',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0001'
  },
  {
    id: 'B-002',
    name: 'ICSE - 10',
    courseName: 'ICSE Class 10 Board Prep',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0002'
  },
  {
    id: 'B-003',
    name: 'Class 9',
    courseName: 'Class 9 Academic Program',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0003'
  },
  {
    id: 'B-004',
    name: 'Class 8',
    courseName: 'Class 8 Academic Program',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0004'
  },
  {
    id: 'B-005',
    name: 'Class 6-7',
    courseName: 'Class 6-7 Foundation Program',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0005'
  }
];

const rawStudents = [
  // --- CBSE - 10 ---
  { name: 'Joel', parentContact: '8668394644', parentName: 'Sundari S', parentEmail: 'sundariasha925@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Vaishnavi', parentContact: '9886458974', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Purochana', parentContact: '9845982410', parentName: 'Roopa A', parentEmail: 'roopaa2024@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Thejas', parentContact: '9945505511', parentName: 'NA', parentEmail: 'NA', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Partial' },
  { name: 'Chirag', parentContact: '9945741087', parentName: 'Jayasheela B N', parentEmail: 'jayasheelab9@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Sanjana', parentContact: '7259601010', parentName: 'Santosh Bonageri', parentEmail: 'santosh.hb@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Akshath', parentContact: '8722491679', parentName: 'NA', parentEmail: 'NA', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Overdue' },
  { name: 'Asmit', parentContact: '9902000499', parentName: 'Kailash Chandra Sahu', parentEmail: 'kailashsahu125@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Vibha', parentContact: '9916940601', parentName: 'Jayalaxmi Ullour', parentEmail: 'jayalaxmi_ullour@yahoo.co.in', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Sagar', parentContact: '9148792344', parentName: 'Deepa R D', parentEmail: 'ddeepard@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Vishnu', parentContact: '9886458974', parentName: 'Dr. Aravind B', parentEmail: 'aravindbdnb@rediffmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Nischitha', parentContact: '9902230580', parentName: 'Nandini Praveen D', parentEmail: 'nandini.cma@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Hindu', parentContact: '9901508029', parentName: 'NA', parentEmail: 'NA', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Overdue' },
  { name: 'Atiksh', parentContact: '8197078792', parentName: 'NA', parentEmail: 'NA', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Partial' },
  { name: 'Gowthami', parentContact: '9741661726', parentName: 'NA', parentEmail: 'NA', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Overdue' },
  { name: 'Vaishwik', parentContact: '8618386353', parentName: 'Komal P Agarwal', parentEmail: 'komalagarwal0282@gmail.com', className: 'CBSE - 10', batchId: 'B-001', courseEnrolled: 'CBSE Class 10 Board Prep', feeStatus: 'Paid' },

  // --- ICSE - 10 ---
  { name: 'Shivani', parentContact: '6362790208', parentName: 'Ambika', parentEmail: 'NA', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Ritvik', parentContact: '9739095911', parentName: 'Mini Mohan', parentEmail: 'minmohan1985@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Kiran', parentContact: '8088172150', parentName: 'Smitha Mole', parentEmail: 'mitamole@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Akshara', parentContact: '9980255867', parentName: 'Raghudas', parentEmail: 'raghudaspanicker7@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Kavinaya', parentContact: '9731952072', parentName: 'Manikandan R', parentEmail: 'manirajv06@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Divi', parentContact: '8105453200', parentName: 'NA', parentEmail: 'NA', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Partial' },
  { name: 'Ishaan', parentContact: '9901434572', parentName: 'Mousumi Roy', parentEmail: 'mousumucroy@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Hrithika', parentContact: '9481424675', parentName: 'Dr I B Hiremath', parentEmail: 'yogesh.bhiremath@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Ryan', parentContact: '8105077994', parentName: 'Smrithi Jacob', parentEmail: 'NA', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Partial' },
  { name: 'Nayan', parentContact: '9986975368', parentName: 'NA', parentEmail: 'NA', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Overdue' },
  { name: 'Navneeth', parentContact: '6363058537', parentName: 'Naveen K Puram', parentEmail: 'naveen.puram@yahoo.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Taarunya', parentContact: '9739891287', parentName: 'Kusuma S', parentEmail: 'kusuma.srinivasa@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },
  { name: 'Darshini', parentContact: '9916116908', parentName: 'NA', parentEmail: 'NA', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Overdue' },
  { name: 'Satakshi', parentContact: '9901115200', parentName: 'Sohandeep Dhar', parentEmail: 'sohandeep.dhar@gmail.com', className: 'ICSE - 10', batchId: 'B-002', courseEnrolled: 'ICSE Class 10 Board Prep', feeStatus: 'Paid' },

  // --- Class 9 ---
  { name: 'Rishabh', parentContact: '9972230647', parentName: 'Bhuvana Mane', parentEmail: 'bhuna2707@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Darshan', parentContact: '7975079659', parentName: 'NA', parentEmail: 'NA', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Partial' },
  { name: 'Nischitha', parentContact: '9886990081', parentName: 'Krishna Kumar K P', parentEmail: 'kkothega@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Neeriksha', parentContact: '9886990081', parentName: 'Krishna Kumar K P', parentEmail: 'kkothega@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Laasya', parentContact: '9886476679', parentName: 'NA', parentEmail: 'NA', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Overdue' },
  { name: 'Ananya', parentContact: '8971334433', parentName: 'Ashok Kumar', parentEmail: 'cherukuriashokkumar@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Gautham', parentContact: '8088154411', parentName: 'Gopi I', parentEmail: 'igopi.hal@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Dhairya', parentContact: '9019163188', parentName: 'Iti Sachan', parentEmail: 'iti.sachan@yahoo.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Chethan', parentContact: '9739891287', parentName: 'Kusuma S', parentEmail: 'kusuma.srinivasa@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Aleena Juno', parentContact: '6282613114', parentName: 'Juno John', parentEmail: 'ponnyjuno@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Varun', parentContact: '9036415661', parentName: 'Mahesh', parentEmail: 'vijaysurya2112@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Maanvi', parentContact: '8123120151', parentName: 'Deepa G J', parentEmail: 'deepagj01@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Aarush', parentContact: '9980092375', parentName: 'Raj Prakash', parentEmail: 'r_rajprakash@yahoo.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Aaryan', parentContact: '9980663100', parentName: 'Gloria Jasmine', parentEmail: 'gloriajas.gj@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Navya', parentContact: '8470088215', parentName: 'Kislay Navin', parentEmail: 'kislay.navin@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },
  { name: 'Anwiti', parentContact: '9886657742', parentName: 'NA', parentEmail: 'NA', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Partial' },
  { name: 'Poorvi', parentContact: '9902829979', parentName: 'NA', parentEmail: 'NA', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Overdue' },
  { name: 'Sukhodeep', parentContact: '9742720391', parentName: 'NA', parentEmail: 'NA', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Partial' },
  { name: 'Pratyuksha', parentContact: '7619379396', parentName: 'Ashwini Suresh', parentEmail: 'ashusuri23@gmail.com', className: 'Class 9', batchId: 'B-003', courseEnrolled: 'Class 9 Academic Program', feeStatus: 'Paid' },

  // --- Class 8 ---
  { name: 'Revin', parentContact: '8105077994', parentName: 'Smrithi Jacob', parentEmail: 'NA', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Mukundan', parentContact: '8296531869', parentName: 'Raja Manickam', parentEmail: 'raja.4ur@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Harnish', parentContact: '9739972367', parentName: 'Deepa', parentEmail: 'deepadinesh4@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Maahi', parentContact: '9980064914', parentName: 'Sukesh Kumar', parentEmail: 'sukesh.rna@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Isa', parentContact: '8867848195', parentName: 'Renu Zachariah', parentEmail: 'renumzachariah@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Lishan', parentContact: '9845852466', parentName: 'Gurushankar K', parentEmail: 'gurushankar.k@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Priyanshu', parentContact: '9886904951', parentName: 'Mukesh Kumar', parentEmail: 'mukesh.aug2012@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Lakshika', parentContact: '9590504696', parentName: 'Gopinath V', parentEmail: 'gopinathvgr@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Nesara', parentContact: '9901290301', parentName: 'Harish C M', parentEmail: 'harishcm81@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Anshul', parentContact: '6363791260', parentName: 'Bindyachal Choubey', parentEmail: 'manisha.ranjan87@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Shreeram', parentContact: '9361966698', parentName: 'Sivasankar V', parentEmail: 'wsivasankar@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Adithi', parentContact: '9900919615', parentName: 'B Manju Pallavi', parentEmail: 'bmanjupallavi@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Kishan', parentContact: '9080765043', parentName: 'Kalaivani K', parentEmail: 'kellykalai826@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Vikas', parentContact: '8123561992', parentName: 'NA', parentEmail: 'NA', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Partial' },
  { name: 'Jhanavi', parentContact: '9980992406', parentName: 'Kalaivani G', parentEmail: 'kalaivanijhanu@gmail.com', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Paid' },
  { name: 'Jaikavish', parentContact: '897165156', parentName: 'NA', parentEmail: 'NA', className: 'Class 8', batchId: 'B-004', courseEnrolled: 'Class 8 Academic Program', feeStatus: 'Overdue' },

  // --- Class 6-7 ---
  { name: 'Madhvik', parentContact: '7090766040', parentName: 'Prabhakar', parentEmail: 'prabhakar.ramaswamy@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Ravin', parentContact: '8088172150', parentName: 'Smitha Mole', parentEmail: 'mitamole@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Japheth', parentContact: '8668394644', parentName: 'Sundari S', parentEmail: 'sundariasha925@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Tharun', parentContact: '9620360964', parentName: 'Amudha M', parentEmail: 'amuda.mukundan@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Tanishi', parentContact: '8884500488', parentName: 'NA', parentEmail: 'NA', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Partial' },
  { name: 'Thanush', parentContact: '8971334433', parentName: 'Ashok Kumar', parentEmail: 'cherukuriashokkumar@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Aditi', parentContact: '6362790208', parentName: 'Ambika', parentEmail: 'NA', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Partial' },
  { name: 'Sarah', parentContact: '8867848195', parentName: 'Renu Zachariah', parentEmail: 'renumzachariah@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Angelina', parentContact: '9972169851', parentName: 'Jesly P J', parentEmail: 'jesjames.pj@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Jignesh', parentContact: '8880222409', parentName: 'Bijaya Mohapatra', parentEmail: 'ijayamohapatra@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' },
  { name: 'Suhani', parentContact: '7259692548', parentName: 'NA', parentEmail: 'NA', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Overdue' },
  { name: 'Mohan', parentContact: '8123120151', parentName: 'Deepa G J', parentEmail: 'deepagj01@gmail.com', className: 'Class 6-7', batchId: 'B-005', courseEnrolled: 'Class 6-7 Foundation Program', feeStatus: 'Paid' }
];

// Format students to match our registry pattern
const getClassPrefix = (className) => {
  if (!className) return 'REG';
  const normalized = className.toUpperCase().replace(/\s+/g, '');
  if (normalized.includes('CBSE-10') || normalized.includes('CBSE10')) return 'CBSE10';
  if (normalized.includes('ICSE-10') || normalized.includes('ICSE10')) return 'ICSE10';
  if (normalized.includes('CLASS9') || normalized.includes('GRADE9')) return 'CL9';
  if (normalized.includes('CLASS8') || normalized.includes('GRADE8')) return 'CL8';
  if (normalized.includes('CLASS6-7') || normalized.includes('CLASS67')) return 'CL67';
  return 'REG';
};

const counters = {};
const students = rawStudents.map((st) => {
  const prefix = getClassPrefix(st.className);
  if (!counters[prefix]) {
    counters[prefix] = 1;
  } else {
    counters[prefix]++;
  }
  const regId = `${prefix}-2026-${String(counters[prefix]).padStart(3, '0')}`;
  return {
    id: regId,
    name: st.name,
    parentName: st.parentName || 'NA',
    parentContact: st.parentContact || 'NA',
    parentEmail: st.parentEmail || 'NA',
    className: st.className,
    courseEnrolled: st.courseEnrolled,
    batchId: st.batchId,
    admissionDate: '2025-09-01',
    feeStatus: st.feeStatus
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
