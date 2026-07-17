import React, { useState, useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { 
  Users, UserCheck, LayoutDashboard, Bookmark, Bell, Plus, Trash2, 
  Search, TrendingUp, DollarSign, Calendar, Sliders, ChevronRight, ChevronLeft, ArrowRightLeft,
  LogOut, Menu, X, BookOpen, ChevronDown, ChevronUp, Key, RefreshCw, Edit
} from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function AdminPortal({ onSignOut }) {
  const { 
    students, teachers, batches, announcements, attendance,
    addStudent, updateStudent, deleteStudent, 
    addTeacher, updateTeacher, deleteTeacher, 
    addAnnouncement, deleteAnnouncement,
    addBatch, updateBatch, deleteBatch
  } = useContext(CRMContext);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredDemoPoint, setHoveredDemoPoint] = useState(null);
  const [hoveredAttPoint, setHoveredAttPoint] = useState(null);

  // Helper for generating smooth cubic Bezier paths
  const getBezierPath = (points) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };
  
  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [showEditBatchModal, setShowEditBatchModal] = useState(false);

  // Accordion lists state
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [expandedTeacherId, setExpandedTeacherId] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);

  // Search/Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterBatch, setStudentFilterBatch] = useState('');

  // Form states
  const [batchForm, setBatchForm] = useState({
    name: '', courseName: 'Advanced Mathematics', timing: '', teacherId: ''
  });
  const [studentForm, setStudentForm] = useState({
    name: '', parentName: '', parentContact: '', parentEmail: '',
    className: 'CBSE - 10', courseEnrolled: 'Advanced Mathematics',
    batchId: '', totalFees: '', feesPaid: '', password: ''
  });
  const [teacherForm, setTeacherForm] = useState({
    name: '', email: '', contact: '', subjects: '', assignedBatches: [], password: ''
  });
  const [annForm, setAnnForm] = useState({
    type: 'Holiday', title: '', content: ''
  });

  const [editStudentForm, setEditStudentForm] = useState({
    id: '', name: '', parentName: '', parentContact: '', parentEmail: '',
    className: 'CBSE - 10', courseEnrolled: 'Advanced Mathematics',
    batchId: '', totalFees: '', feesPaid: '', password: ''
  });
  const [editTeacherForm, setEditTeacherForm] = useState({
    id: '', name: '', email: '', contact: '', subjects: '', assignedBatches: [], password: ''
  });
  const [editBatchForm, setEditBatchForm] = useState({
    id: '', name: '', courseName: 'Advanced Mathematics', timing: '', teacherId: ''
  });

  const [showPassModal, setShowPassModal] = useState(false);
  const [passTarget, setPassTarget] = useState(null); // { type: 'student'|'teacher', data: object }
  const [newPassVal, setNewPassVal] = useState('');
  const [selectedFeeStudentId, setSelectedFeeStudentId] = useState('');

  // Find selected student for Fee Ledger (defaults to first student if none selected/found)
  const selectedStudent = students.find(s => s.id === selectedFeeStudentId) || (students.length > 0 ? students[0] : null);

  // KPI Calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalBatches = batches.length;
  
  // Paid/Unpaid Stats
  const paidCount = students.filter(s => {
    const total = s.totalFees !== undefined ? s.totalFees : 0;
    const paid = s.feesPaid !== undefined ? s.feesPaid : 0;
    return total > 0 ? paid >= total : paid > 0;
  }).length;
  const partialCount = students.filter(s => {
    const total = s.totalFees !== undefined ? s.totalFees : 0;
    const paid = s.feesPaid !== undefined ? s.feesPaid : 0;
    return total > 0 && paid > 0 && paid < total;
  }).length;
  const overdueCount = students.filter(s => (s.feesPaid || 0) === 0).length;

  const totalExpectedFees = students.reduce((sum, s) => sum + (s.totalFees || 0), 0);
  const totalCollectedFees = students.reduce((sum, s) => sum + (s.feesPaid || 0), 0);
  const totalOutstandingFees = Math.max(0, totalExpectedFees - totalCollectedFees);

  // Render SVG Demographic Chart
  const renderDemographicChart = () => {
    const counts = { 'CBSE - 10': 0, 'ICSE - 10': 0, 'Class 9': 0, 'Class 8': 0, 'Class 6-7': 0 };
    students.forEach(s => {
      if (counts[s.className] !== undefined) {
        counts[s.className]++;
      }
    });

    const maxVal = Math.max(...Object.values(counts), 1);
    const data = Object.entries(counts);

    return (
      <div className="chart-container" style={{ position: 'relative' }}>
        {/* Demographic Interactive Tooltip */}
        {hoveredDemoPoint && (
          <div 
            className="chart-tooltip" 
            style={{ 
              left: `${hoveredDemoPoint.x}px`, 
              top: `${hoveredDemoPoint.y - 45}px`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              opacity: 1
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>{hoveredDemoPoint.label}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
              Enrolled: <strong style={{ color: 'var(--color-primary)' }}>{hoveredDemoPoint.val} Students</strong>
            </div>
          </div>
        )}

        <svg className="chart-svg" viewBox="0 0 500 200">
          <defs>
            <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="30" y1="30" x2="470" y2="30" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="30" y1="80" x2="470" y2="80" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="30" y1="130" x2="470" y2="130" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="30" y1="170" x2="470" y2="170" stroke="var(--border-color)" strokeWidth="1" />

          {data.map(([label, val], idx) => {
            const barWidth = 40;
            const barSpacing = 85;
            const x = 55 + idx * barSpacing;
            const height = (val / maxVal) * 120;
            const y = 170 - height;
            const isHovered = hoveredDemoPoint && hoveredDemoPoint.label === label;
            
            return (
              <g 
                key={label}
                onMouseEnter={() => setHoveredDemoPoint({ label, val, x: x + barWidth/2, y })}
                onMouseLeave={() => setHoveredDemoPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Round top corners bar */}
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  rx="6" 
                  ry="6"
                  fill="url(#bar-gradient)"
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'all 0.15s ease' }}
                />
                {/* Overlay covering bottom corners to keep base flat */}
                {height > 6 && (
                  <rect 
                    x={x} 
                    y={y + height - 6} 
                    width={barWidth} 
                    height={6} 
                    fill="url(#bar-gradient)"
                    opacity={isHovered ? 1 : 0.85}
                    pointerEvents="none"
                  />
                )}
                <text 
                  x={x + barWidth/2} 
                  y={y - 8} 
                  textAnchor="middle" 
                  fill="var(--text-primary)" 
                  fontSize="10" 
                  fontWeight="700"
                >
                  {val}
                </text>
                <text x={x + barWidth/2} y="185" textAnchor="middle" className="chart-axis-text" fontWeight="600">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };



  // Render SVG Attendance Trend Chart
  const renderAttendanceChart = () => {
    // Dynamically calculate attendance trend from DB records
    const datesMap = {}; // date -> { present: 0, total: 0 }
    
    Object.keys(attendance || {}).forEach(key => {
      const parts = key.split('_');
      if (parts.length >= 2) {
        const date = parts[1];
        const records = attendance[key] || {};
        
        if (!datesMap[date]) {
          datesMap[date] = { present: 0, total: 0 };
        }
        
        Object.values(records).forEach(status => {
          datesMap[date].total++;
          if (status === 'Present') {
            datesMap[date].present++;
          }
        });
      }
    });
    
    const trendData = Object.entries(datesMap).map(([dateStr, stats]) => {
      const rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 100;
      let displayDate = dateStr;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          displayDate = `${parts[1]}-${parts[2]}`; // MM-DD
        }
      }
      return { 
        rawDate: dateStr, 
        date: displayDate, 
        rate 
      };
    });
    
    // Sort by rawDate chronologically
    trendData.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    
    // Fallback if no records exist yet
    const data = trendData.length > 0 ? trendData.slice(-7) : [
      { date: '07-01', rate: 80 },
      { date: '07-02', rate: 85 },
      { date: '07-03', rate: 75 }
    ];

    const width = 400;
    const height = 200;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const points = data.map((item, idx) => {
      const x = paddingLeft + (idx * (width - paddingLeft - paddingRight) / Math.max(data.length - 1, 1));
      const y = height - paddingBottom - (item.rate / 100) * (height - paddingTop - paddingBottom);
      return { x, y, label: item.date, value: `${item.rate}%` };
    });

    const dPath = getBezierPath(points);
    const dArea = points.length > 0 ? `${dPath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` : '';

    return (
      <div className="chart-container" style={{ position: 'relative' }}>
        {/* Attendance Interactive Tooltip */}
        {hoveredAttPoint && (
          <div 
            className="chart-tooltip" 
            style={{ 
              left: `${hoveredAttPoint.x}px`, 
              top: `${hoveredAttPoint.y - 45}px`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              opacity: 1
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>Date: {hoveredAttPoint.label}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
              Attendance: <strong style={{ color: 'var(--color-primary)' }}>{hoveredAttPoint.value}</strong>
            </div>
          </div>
        )}

        <svg className="chart-svg" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="att-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="40" y1="30" x2="380" y2="30" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="40" y1="90" x2="380" y2="90" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="40" y1="150" x2="380" y2="150" className="chart-grid-line" strokeWidth="0.5" />
          <line x1="40" y1="170" x2="380" y2="170" stroke="var(--border-color)" strokeWidth="1" />

          {/* Area under curve */}
          {points.length > 0 && (
            <path 
              d={dArea} 
              fill="url(#att-gradient)"
              opacity="0.6"
            />
          )}

          {/* Line path */}
          <path 
            d={dPath} 
            className="chart-line"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points */}
          {points.map((p, idx) => {
            const isHovered = hoveredAttPoint && hoveredAttPoint.label === p.label;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredAttPoint(p)}
                onMouseLeave={() => setHoveredAttPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow Ring */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 8 : 4.5} 
                  fill="var(--color-secondary)" 
                  opacity={isHovered ? 0.35 : 0} 
                  style={{ transition: 'r 0.15s ease, opacity 0.15s ease' }}
                />
                {/* Central point */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4.5" 
                  fill={isHovered ? 'var(--color-primary)' : 'var(--color-secondary)'} 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5"
                  style={{ transition: 'fill 0.15s ease' }}
                />
                <text 
                  x={p.x} 
                  y={p.y - 10} 
                  textAnchor="middle" 
                  fill="var(--text-primary)" 
                  fontSize="8" 
                  fontWeight="700"
                >
                  {p.value}
                </text>
                <text x={p.x} y="185" textAnchor="middle" className="chart-axis-text" fontWeight="600">
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Student Actions
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    addStudent({
      ...studentForm,
      password: studentForm.password.trim() || studentForm.parentContact.trim(),
      totalFees: studentForm.totalFees !== '' ? parseInt(studentForm.totalFees) : 0,
      feesPaid: studentForm.feesPaid !== '' ? parseInt(studentForm.feesPaid) : 0
    });
    setStudentForm({
      name: '', parentName: '', parentContact: '', parentEmail: '',
      className: 'CBSE - 10', courseEnrolled: 'Advanced Mathematics',
      batchId: '', totalFees: '', feesPaid: '', password: ''
    });
    setShowStudentModal(false);
  };

  const handleEditStudentSubmit = (e) => {
    e.preventDefault();
    updateStudent({
      ...editStudentForm,
      totalFees: editStudentForm.totalFees !== '' ? parseInt(editStudentForm.totalFees) : 0,
      feesPaid: editStudentForm.feesPaid !== '' ? parseInt(editStudentForm.feesPaid) : 0
    });
    setShowEditStudentModal(false);
  };

  // Teacher Actions
  const handleTeacherBatchToggle = (batchId) => {
    const current = teacherForm.assignedBatches || [];
    const updated = current.includes(batchId)
      ? current.filter(id => id !== batchId)
      : [...current, batchId];
    setTeacherForm({ ...teacherForm, assignedBatches: updated });
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    const subArray = teacherForm.subjects.split(',').map(s => s.trim()).filter(Boolean);
    
    addTeacher({
      name: teacherForm.name,
      email: teacherForm.email,
      contact: teacherForm.contact,
      subjects: subArray,
      assignedBatches: teacherForm.assignedBatches,
      password: teacherForm.password.trim() || teacherForm.contact.trim()
    });

    setTeacherForm({ name: '', email: '', contact: '', subjects: '', assignedBatches: [], password: '' });
    setShowTeacherModal(false);
  };

  const handleEditTeacherBatchToggle = (batchId) => {
    const current = editTeacherForm.assignedBatches || [];
    const updated = current.includes(batchId)
      ? current.filter(id => id !== batchId)
      : [...current, batchId];
    setEditTeacherForm({ ...editTeacherForm, assignedBatches: updated });
  };

  const handleEditTeacherSubmit = (e) => {
    e.preventDefault();
    const subArray = typeof editTeacherForm.subjects === 'string'
      ? editTeacherForm.subjects.split(',').map(s => s.trim()).filter(Boolean)
      : editTeacherForm.subjects;
    updateTeacher({
      ...editTeacherForm,
      subjects: subArray
    });
    setShowEditTeacherModal(false);
  };

  const openEditStudent = (student) => {
    setEditStudentForm({
      id: student.id,
      name: student.name || '',
      parentName: student.parentName || '',
      parentContact: student.parentContact || '',
      parentEmail: student.parentEmail || '',
      className: student.className || 'CBSE - 10',
      courseEnrolled: student.courseEnrolled || 'Advanced Mathematics',
      batchId: student.batchId || '',
      totalFees: student.totalFees !== undefined ? String(student.totalFees) : '',
      feesPaid: student.feesPaid !== undefined ? String(student.feesPaid) : '',
      password: student.password || ''
    });
    setShowEditStudentModal(true);
  };

  const openEditTeacher = (teacher) => {
    setEditTeacherForm({
      id: teacher.id,
      name: teacher.name || '',
      email: teacher.email || '',
      contact: teacher.contact || '',
      subjects: Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : '',
      assignedBatches: teacher.assignedBatches || [],
      password: teacher.password || ''
    });
    setShowEditTeacherModal(true);
  };

  const openPassModal = (type, data) => {
    setPassTarget({ type, data });
    setNewPassVal(data.password || (type === 'student' ? data.parentContact : data.contact));
    setShowPassModal(true);
  };

  const handleUpdateStudentPassword = (student) => {
    openPassModal('student', student);
  };

  const handleUpdateTeacherPassword = (teacher) => {
    openPassModal('teacher', teacher);
  };




  // Batch Actions
  const handleBatchSubmit = (e) => {
    e.preventDefault();
    if (!batchForm.name || !batchForm.timing) {
      alert('Please fill out batch name and timings.');
      return;
    }
    addBatch(batchForm);
    setBatchForm({ name: '', courseName: 'Advanced Mathematics', timing: '', teacherId: '' });
    setShowBatchModal(false);
  };

  const handleEditBatchSubmit = (e) => {
    e.preventDefault();
    if (!editBatchForm.name || !editBatchForm.timing) {
      alert('Please fill out batch name and timings.');
      return;
    }
    updateBatch(editBatchForm);
    setShowEditBatchModal(false);
  };

  const openEditBatch = (batch) => {
    setEditBatchForm({
      id: batch.id,
      name: batch.name || '',
      courseName: batch.courseName || 'Advanced Mathematics',
      timing: batch.timing || '',
      teacherId: batch.teacherId || ''
    });
    setShowEditBatchModal(true);
  };

  // Announcement Actions
  const handleAnnSubmit = (e) => {
    e.preventDefault();
    addAnnouncement(annForm);
    setAnnForm({ type: 'Holiday', title: '', content: '' });
    setShowAnnModal(false);
  };

  // Filtering Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.id.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesBatch = studentFilterBatch ? s.batchId === studentFilterBatch : true;
    return matchesSearch && matchesBatch;
  }).sort((a, b) => {
    const totalA = a.totalFees !== undefined ? a.totalFees : 0;
    const totalB = b.totalFees !== undefined ? b.totalFees : 0;
    const statusA = (a.feesPaid || 0) === 0 ? 0 : ((a.feesPaid || 0) < totalA ? 1 : 2);
    const statusB = (b.feesPaid || 0) === 0 ? 0 : ((b.feesPaid || 0) < totalB ? 1 : 2);
    
    if (statusA !== statusB) {
      return statusA - statusB; // Unpaid (0) first, Partial (1) second, Paid (2) last
    }
    if (statusA === 1) {
      return (a.feesPaid || 0) - (b.feesPaid || 0); // "Paid less" (lowest paid) on top
    }
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <header className="portal-header">
        <div className="portal-header-left" style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <PERCLogo variant="horizontal" height={36} />
          <span className="portal-badge" style={{ marginLeft: '12px' }}>Administrative Portal</span>
        </div>
        <div className="portal-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="user-avatar-wrap">
            <div className="user-avatar-badge" title="Administrator">
              AD
              <span className="active-dot"></span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={onSignOut}>
            <LogOut size={16} /> <span className="hide-on-mobile">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="crm-layout" style={{ flexGrow: 1, minHeight: 'unset' }}>
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
        )}
      {/* Sidebar */}
      <aside className={`crm-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveTab('students'); setIsSidebarOpen(false); }}
          >
            <Users size={18} />
            Students Roster
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('teachers'); setIsSidebarOpen(false); }}
          >
            <UserCheck size={18} />
            Faculty Oversight
          </li>

          <li 
            className={`sidebar-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => { setActiveTab('announcements'); setIsSidebarOpen(false); }}
          >
            <Bell size={18} />
            Announcements
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'batches' ? 'active' : ''}`}
            onClick={() => { setActiveTab('batches'); setIsSidebarOpen(false); }}
          >
            <BookOpen size={18} />
            Academic Batches
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="crm-main fade-in">
        <div className="panel-header">
          <h2 className="panel-title">
            {activeTab === 'dashboard' && 'Institutional Dashboard'}
            {activeTab === 'students' && 'Student Administration'}
            {activeTab === 'teachers' && 'Faculty Management'}
            {activeTab === 'announcements' && 'Communication Hub'}
            {activeTab === 'batches' && 'Academic Batch Management'}
          </h2>
          
          {activeTab === 'students' && (
            <button className="btn btn-primary" onClick={() => setShowStudentModal(true)}>
              <Plus size={16} /> Enroll New Student
            </button>
          )}
          {activeTab === 'teachers' && (
            <button className="btn btn-primary" onClick={() => setShowTeacherModal(true)}>
              <Plus size={16} /> Onboard Faculty
            </button>
          )}

          {activeTab === 'announcements' && (
            <button className="btn btn-primary" onClick={() => setShowAnnModal(true)}>
              <Plus size={16} /> New Circular / Alert
            </button>
          )}
          {activeTab === 'batches' && (
            <button className="btn btn-primary" onClick={() => setShowBatchModal(true)}>
              <Plus size={16} /> Create New Batch
            </button>
          )}
        </div>

        {/* Tab Contents */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stat Cards */}
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)' }}>
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{totalStudents}</span>
                  <span className="stat-label">Enrolled Students</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--color-secondary-glow)', color: 'var(--color-secondary)' }}>
                  <UserCheck size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{totalTeachers}</span>
                  <span className="stat-label">Onboard Faculty</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
                  <Bookmark size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{totalBatches}</span>
                  <span className="stat-label">Active Batches</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">₹{totalCollectedFees}</span>
                  <span className="stat-label">Collected Fees</span>
                </div>
              </div>
            </div>

            <div className="graphs-grid">
              <div className="crm-card">
                <h3 className="crm-card-title">
                  <Users size={18} color="var(--color-primary)" />
                  Demographics (Students per Grade)
                </h3>
                {renderDemographicChart()}
              </div>



              <div className="crm-card">
                <h3 className="crm-card-title">
                  <Calendar size={18} color="var(--color-info)" />
                  Weekly Attendance Trend
                </h3>
                {renderAttendanceChart()}
              </div>
            </div>

            {/* Fee Status Summary */}
            <div className="crm-card">
              <h3 className="crm-card-title">
                <DollarSign size={18} color="var(--color-success)" />
                Fee Payment Collections & Financial Ledger
              </h3>
              <div className="fee-summary-grid">
                <div className="profile-meta-grid fee-summary-col">
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Cleared Accounts</span>
                    <span className="profile-meta-val badge badge-success">{paidCount} Students</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Partial Remittances</span>
                    <span className="profile-meta-val badge badge-warning">{partialCount} Students</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Outstanding Invoices</span>
                    <span className="profile-meta-val badge badge-danger">{overdueCount} Students</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Account Cleared Rate</span>
                    <span className="profile-meta-val" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                      {((paidCount + (partialCount * 0.5)) / (totalStudents || 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="profile-meta-grid fee-summary-col split-col">
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Total Expected Fees</span>
                    <span className="profile-meta-val" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>₹{totalExpectedFees}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Total Fees Collected</span>
                    <span className="profile-meta-val" style={{ fontWeight: '700', color: 'var(--color-success)' }}>₹{totalCollectedFees}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Total Outstanding Dues</span>
                    <span className="profile-meta-val" style={{ fontWeight: '700', color: 'var(--color-danger)' }}>₹{totalOutstandingFees}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Dues Collection Efficiency</span>
                    <span className="profile-meta-val" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                      {((totalCollectedFees / (totalExpectedFees || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Student Fee Ledger */}
            <div className="crm-card" style={{ marginTop: '24px' }}>
              <h3 className="crm-card-title">
                <Users size={18} color="var(--color-primary)" />
                Individual Student Fee Ledger
              </h3>
              
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="feeStudentSelect" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Select Student to View Fee Details:
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select 
                    id="feeStudentSelect"
                    value={selectedStudent ? selectedStudent.id : ''} 
                    onChange={(e) => setSelectedFeeStudentId(e.target.value)} 
                    className="select-dropdown"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.95rem' }}
                  >
                    {students.length > 0 ? (
                      students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.id}) — {student.className}
                        </option>
                      ))
                    ) : (
                      <option value="">No students available</option>
                    )}
                  </select>
                </div>
              </div>

              {selectedStudent ? (
                (() => {
                  const paid = selectedStudent.feesPaid !== undefined ? selectedStudent.feesPaid : 0;
                  const total = selectedStudent.totalFees !== undefined ? selectedStudent.totalFees : 0;
                  const balance = Math.max(0, total - paid);
                  const percentPaid = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
                  
                  let statusBadge = <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Unpaid</span>;
                  if (paid >= total && total > 0) {
                    statusBadge = <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Fully Paid</span>;
                  } else if (paid > 0) {
                    statusBadge = <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Partial Payment</span>;
                  }

                  return (
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '12px', 
                      padding: '24px', 
                      marginTop: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: '16px', 
                        marginBottom: '20px', 
                        borderBottom: '1px solid var(--border-color)', 
                        paddingBottom: '16px' 
                      }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {selectedStudent.name}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <span><strong>Reg No:</strong> {selectedStudent.id}</span>
                            <span><strong>Class:</strong> {selectedStudent.className}</span>
                            {selectedStudent.courseEnrolled && <span><strong>Course:</strong> {selectedStudent.courseEnrolled}</span>}
                          </div>
                        </div>
                        <div>
                          {statusBadge}
                        </div>
                      </div>

                      {/* Financial Detail Grid */}
                      <div className="fee-summary-grid" style={{ 
                        gap: '16px', 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        marginBottom: '24px' 
                      }}>
                        <div style={{ 
                          background: 'rgba(52, 152, 219, 0.05)', 
                          border: '1px solid rgba(52, 152, 219, 0.15)', 
                          borderRadius: '8px', 
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Course Fees</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{total}</span>
                        </div>
                        
                        <div style={{ 
                          background: 'rgba(46, 204, 113, 0.05)', 
                          border: '1px solid rgba(46, 204, 113, 0.15)', 
                          borderRadius: '8px', 
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fees Paid So Far</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>₹{paid}</span>
                        </div>
                        
                        <div style={{ 
                          background: balance > 0 ? 'rgba(231, 76, 60, 0.05)' : 'rgba(127, 140, 141, 0.05)', 
                          border: balance > 0 ? '1px solid rgba(231, 76, 60, 0.15)' : '1px solid rgba(127, 140, 141, 0.15)', 
                          borderRadius: '8px', 
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outstanding Dues</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: balance > 0 ? 'var(--color-danger)' : 'var(--text-muted)' }}>₹{balance}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Payment Completion Progress</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{percentPaid}%</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '10px', 
                          background: 'rgba(255, 255, 255, 0.08)', 
                          borderRadius: '5px', 
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${percentPaid}%`, 
                            height: '100%', 
                            background: percentPaid === 100 ? 'var(--color-success)' : 'var(--color-primary)', 
                            borderRadius: '5px',
                            transition: 'width 0.5s ease-out'
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 24px', 
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}>
                  No student ledger records found.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <>
            {/* Search & Filter Toolbar */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search students by registration number or name..." 
                  className="form-input" 
                  style={{ paddingLeft: '40px', width: '100%' }}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <select 
                value={studentFilterBatch}
                onChange={(e) => setStudentFilterBatch(e.target.value)}
                className="select-dropdown"
              >
                <option value="">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Students Table - Desktop Only */}
            <div className="desktop-only-table table-wrapper">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Name</th>
                    <th>Course & Class</th>
                    <th>Batch</th>
                    <th>Parent & Contact</th>
                    <th>Fee Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      const batch = batches.find(b => b.id === student.batchId);
                      return (
                        <tr key={student.id}>
                          <td style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{student.id}</td>
                          <td>{student.name}</td>
                          <td>
                            <div>{student.courseEnrolled}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.className}</div>
                          </td>
                          <td>{batch ? batch.name : <span className="text-muted">Unassigned</span>}</td>
                          <td>
                            <div>{student.parentName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.parentContact}</div>
                          </td>
                          <td>
                            {(() => {
                              const paid = student.feesPaid || 0;
                              const total = student.totalFees !== undefined ? student.totalFees : 0;
                              if (paid === 0) {
                                return <span className="badge badge-danger">Unpaid (₹0/₹{total})</span>;
                              } else if (paid < total) {
                                return <span className="badge badge-warning">Partial (₹{paid}/₹{total})</span>;
                              } else {
                                return <span className="badge badge-success">Paid (₹{paid}/₹{total})</span>;
                              }
                            })()}
                          </td>
                          <td>
                            <button 
                              className="lead-action-btn"
                              style={{ color: 'var(--color-info)', marginRight: '8px' }}
                              onClick={() => openEditStudent(student)}
                              title="Edit Student"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="lead-action-btn"
                              style={{ color: 'var(--color-warning, #f59e0b)', marginRight: '8px' }}
                              onClick={() => handleUpdateStudentPassword(student)}
                              title="Change Password"
                            >
                              <Key size={16} />
                            </button>
                            <button 
                              className="lead-action-btn"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No students found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Students Accordion - Mobile Only */}
            <div className="mobile-only-list accordion-list">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const batch = batches.find(b => b.id === student.batchId);
                  const isExpanded = expandedStudentId === student.id;
                  return (
                    <div 
                      key={student.id} 
                      className="accordion-item"
                      onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    >
                      <div className="accordion-header">
                        <div>
                          <div className="accordion-title">{student.name}</div>
                          <div className="accordion-subtitle">{student.id} | {student.courseEnrolled}</div>
                        </div>
                        <div>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="accordion-details">
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Class Level</span>
                            <span className="accordion-detail-value">{student.className}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Assigned Batch</span>
                            <span className="accordion-detail-value">{batch ? batch.name : 'Unassigned'}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Parent Name</span>
                            <span className="accordion-detail-value">{student.parentName}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Parent Contact</span>
                            <span className="accordion-detail-value">{student.parentContact}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Fee Status</span>
                            <span className="accordion-detail-value">
                             {(() => {
                               const paid = student.feesPaid || 0;
                               const total = student.totalFees !== undefined ? student.totalFees : 0;
                               if (paid === 0) {
                                 return <span className="badge badge-danger">Unpaid (₹{paid}/₹{total})</span>;
                               } else if (paid < total) {
                                 return <span className="badge badge-warning">Partial (₹{paid}/₹{total})</span>;
                               } else {
                                 return <span className="badge badge-success">Paid (₹{paid}/₹{total})</span>;
                               }
                             })()}
                           </span>
                          </div>
                          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                             <button 
                               className="btn btn-primary" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: 'none' }}
                               onClick={(e) => { e.stopPropagation(); openEditStudent(student); }}
                             >
                               <Edit size={12} /> Edit
                             </button>
                             <button 
                               className="btn btn-secondary" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-warning, #f59e0b)', color: '#fff', border: 'none' }}
                               onClick={(e) => { e.stopPropagation(); handleUpdateStudentPassword(student); }}
                             >
                               <Key size={12} /> Password
                             </button>
                             <button 
                               className="btn btn-danger" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                               onClick={(e) => { e.stopPropagation(); deleteStudent(student.id); }}
                             >
                               <Trash2 size={12} /> Delete
                             </button>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">No students found matching filters.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'teachers' && (
          <>
            {/* Faculty Table - Desktop Only */}
            <div className="desktop-only-table table-wrapper">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Faculty ID</th>
                    <th>Name</th>
                    <th>Email & Contact</th>
                    <th>Subjects</th>
                    <th>Assigned Batches</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{t.id}</td>
                      <td>{t.name}</td>
                      <td>
                        <div>{t.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.contact}</div>
                      </td>
                      <td>
                        {t.subjects.map(s => (
                          <span key={s} className="badge badge-info" style={{ marginRight: '4px', textTransform: 'none' }}>{s}</span>
                        ))}
                      </td>
                      <td>
                        {(() => {
                          const tBatches = batches.filter(b => b.teacherId === t.id || (t.assignedBatches && t.assignedBatches.includes(b.id)));
                          if (tBatches.length === 0) return <span className="text-muted" style={{ fontSize: '0.8rem' }}>None</span>;
                          return tBatches.map(bt => (
                            <span key={bt.id} className="badge badge-success" style={{ marginRight: '4px', textTransform: 'none' }}>
                              {bt.name}
                            </span>
                          ));
                        })()}
                      </td>
                      <td>
                        <button 
                          className="lead-action-btn"
                          style={{ color: 'var(--color-info)', marginRight: '8px' }}
                          onClick={() => openEditTeacher(t)}
                          title="Edit Faculty"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="lead-action-btn"
                          style={{ color: 'var(--color-warning, #f59e0b)', marginRight: '8px' }}
                          onClick={() => handleUpdateTeacherPassword(t)}
                          title="Change Password"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          className="lead-action-btn"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => deleteTeacher(t.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Faculty Accordion - Mobile Only */}
            <div className="mobile-only-list accordion-list">
              {teachers.length > 0 ? (
                teachers.map(teacher => {
                  const isExpanded = expandedTeacherId === teacher.id;
                  const teacherBatches = batches.filter(b => b.teacherId === teacher.id || (teacher.assignedBatches && teacher.assignedBatches.includes(b.id)));
                  return (
                    <div 
                      key={teacher.id} 
                      className="accordion-item"
                      onClick={() => setExpandedTeacherId(isExpanded ? null : teacher.id)}
                    >
                      <div className="accordion-header">
                        <div>
                          <div className="accordion-title">{teacher.name}</div>
                          <div className="accordion-subtitle">{teacher.id}</div>
                        </div>
                        <div>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="accordion-details">
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Email</span>
                            <span className="accordion-detail-value">{teacher.email}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Contact No</span>
                            <span className="accordion-detail-value">{teacher.contact}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Expertise</span>
                            <span className="accordion-detail-value">{teacher.subjects.join(', ')}</span>
                          </div>
                          <div className="accordion-detail-row">
                            <span className="accordion-detail-label">Assigned Batches</span>
                            <span className="accordion-detail-value">
                              {teacherBatches.map(b => b.name).join(', ') || 'None'}
                            </span>
                          </div>
                          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                             <button 
                               className="btn btn-primary" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: 'none' }}
                               onClick={(e) => { e.stopPropagation(); openEditTeacher(teacher); }}
                             >
                               <Edit size={12} /> Edit
                             </button>
                             <button 
                               className="btn btn-secondary" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-warning, #f59e0b)', color: '#fff', border: 'none' }}
                               onClick={(e) => { e.stopPropagation(); handleUpdateTeacherPassword(teacher); }}
                             >
                               <Key size={12} /> Password
                             </button>
                             <button 
                               className="btn btn-danger" 
                               style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                               onClick={(e) => { e.stopPropagation(); deleteTeacher(teacher.id); }}
                             >
                               <Trash2 size={12} /> Delete
                             </button>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">No faculty members onboarded yet.</div>
              )}
            </div>
          </>
        )}



        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.map(ann => (
              <div key={ann.id} className="notification-item">
                <div className="notification-badge-wrapper">
                  <span className={`notification-type ${ann.type.toLowerCase()}`}>{ann.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="notification-date">{ann.date}</span>
                    <button 
                      className="lead-action-btn"
                      style={{ color: 'var(--color-danger)' }}
                      onClick={() => deleteAnnouncement(ann.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="notification-title">{ann.title}</div>
                <div className="notification-body">{ann.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="tab-pane fade-in">
            {batches.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} className="empty-state-icon" style={{ color: 'var(--color-primary)' }} />
                <h3>No Academic Batches Configured</h3>
                <p>Register schedules and assign instructors to open learning tracks.</p>
                <button className="btn btn-primary" onClick={() => setShowBatchModal(true)} style={{ marginTop: '16px' }}>
                  Create First Batch
                </button>
              </div>
            ) : (
              <>
                {/* Batches Table - Desktop Only */}
                <div className="desktop-only-table table-wrapper">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Batch Name</th>
                        <th>Course Name</th>
                        <th>Class Timing</th>
                        <th>Assigned Faculty</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map(b => {
                        const teacher = teachers.find(t => t.id === b.teacherId);
                        return (
                          <tr key={b.id}>
                            <td><strong>{b.id}</strong></td>
                            <td>{b.name}</td>
                            <td>{b.courseName}</td>
                            <td>{b.timing}</td>
                            <td>
                              {teacher ? (
                                <span className="badge badge-success">{teacher.name}</span>
                              ) : (
                                <span className="text-muted">Unassigned</span>
                              )}
                            </td>
                            <td>
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => openEditBatch(b)}
                                style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => deleteBatch(b.id)}
                                style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(220,38,38,0.1)', color: 'rgb(220,38,38)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Batches Accordion - Mobile Only */}
                <div className="mobile-only-list accordion-list">
                  {batches.map(batch => {
                    const teacher = teachers.find(t => t.id === batch.teacherId);
                    const isExpanded = expandedBatchId === batch.id;
                    return (
                      <div 
                        key={batch.id} 
                        className="accordion-item"
                        onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                      >
                        <div className="accordion-header">
                          <div>
                            <div className="accordion-title">{batch.name}</div>
                            <div className="accordion-subtitle">{batch.id} | {batch.courseName}</div>
                          </div>
                          <div>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="accordion-details">
                            <div className="accordion-detail-row">
                              <span className="accordion-detail-label">Timing</span>
                              <span className="accordion-detail-value">{batch.timing}</span>
                            </div>
                            <div className="accordion-detail-row">
                              <span className="accordion-detail-label">Instructor</span>
                              <span className="accordion-detail-value">{teacher ? teacher.name : 'Unassigned'}</span>
                            </div>
                            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: 'none' }}
                                onClick={(e) => { e.stopPropagation(); openEditBatch(batch); }}
                              >
                                <Edit size={12} /> Edit Batch
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={(e) => { e.stopPropagation(); deleteBatch(batch.id); }}
                              >
                                <Trash2 size={12} /> Delete Batch
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal Forms */}
      
      {/* Student Enrollment Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Enroll New Student</h3>
              <button className="close-btn" onClick={() => setShowStudentModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleStudentSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={studentForm.name} 
                    onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Parent Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      value={studentForm.parentName}
                      onChange={e => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent Contact Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input"
                      value={studentForm.parentContact}
                      onChange={e => setStudentForm({ ...studentForm, parentContact: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input"
                    value={studentForm.parentEmail}
                    onChange={e => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select 
                      className="select-dropdown"
                      value={studentForm.className}
                      onChange={e => setStudentForm({ ...studentForm, className: e.target.value })}
                    >
                      <option>CBSE - 10</option>
                      <option>ICSE - 10</option>
                      <option>Class 9</option>
                      <option>Class 8</option>
                      <option>Class 6-7</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course Enrolled</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      value={studentForm.courseEnrolled}
                      onChange={e => setStudentForm({ ...studentForm, courseEnrolled: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Smart Batch Assignment</label>
                    <select 
                      className="select-dropdown"
                      value={studentForm.batchId}
                      onChange={e => setStudentForm({ ...studentForm, batchId: e.target.value })}
                    >
                      <option value="">No Batch Assigned</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Course Fees (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={studentForm.totalFees}
                      onChange={e => setStudentForm({ ...studentForm, totalFees: e.target.value })}
                      placeholder="e.g. 6000"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fees Paid So Far (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={studentForm.feesPaid}
                      onChange={e => setStudentForm({ ...studentForm, feesPaid: e.target.value })}
                      placeholder="e.g. 3500"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="form-label">Login Password / Verification PIN</label>
                  <input 
                    type="password" 
                    placeholder="Defaults to parent contact number if empty"
                    className="form-input"
                    value={studentForm.password || ''}
                    onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowStudentModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Complete Onboarding</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Onboarding Modal */}
      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Onboard Faculty Member</h3>
              <button className="close-btn" onClick={() => setShowTeacherModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleTeacherSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Teacher Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={teacherForm.name}
                    onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input"
                      value={teacherForm.email}
                      onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input"
                      value={teacherForm.contact}
                      onChange={e => setTeacherForm({ ...teacherForm, contact: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Areas (Comma Separated)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Pure Mathematics, Analytical Geometry"
                    className="form-input"
                    value={teacherForm.subjects}
                    onChange={e => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                  />
                </div>
                 <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '8px' }}>Assign Batches</label>
                  {batches.length === 0 ? (
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>No active batches found. Create a batch first.</span>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(30, 34, 63, 0.03)', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', maxHeight: '120px', overflowY: 'auto' }}>
                      {batches.map(b => (
                        <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                          <input 
                            type="checkbox" 
                            checked={teacherForm.assignedBatches?.includes(b.id) || false}
                            onChange={() => handleTeacherBatchToggle(b.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          {b.name} ({b.courseName})
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="form-label">Login Password</label>
                  <input 
                    type="password" 
                    placeholder="Defaults to teacher contact number if empty"
                    className="form-input"
                    value={teacherForm.password || ''}
                    onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowTeacherModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Onboard Teacher</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Announcements Modal */}
      {showAnnModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Broadcast Official Announcement</h3>
              <button className="close-btn" onClick={() => setShowAnnModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAnnSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Announcement Category</label>
                  <select 
                    className="select-dropdown"
                    value={annForm.type}
                    onChange={e => setAnnForm({ ...annForm, type: e.target.value })}
                  >
                    <option>Holiday</option>
                    <option>Exam</option>
                    <option>Fee</option>
                    <option>Circular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={annForm.title}
                    onChange={e => setAnnForm({ ...annForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Content Message Body</label>
                  <textarea 
                    required 
                    className="form-input" 
                    rows="4" 
                    style={{ resize: 'vertical' }}
                    value={annForm.content}
                    onChange={e => setAnnForm({ ...annForm, content: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAnnModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Broadcast Now</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create Academic Batch</h3>
              <button className="close-btn" onClick={() => setShowBatchModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleBatchSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Batch Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Batch Delta"
                    className="form-input"
                    value={batchForm.name}
                    onChange={e => setBatchForm({ ...batchForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Program</label>
                  <select 
                    className="select-dropdown"
                    value={batchForm.courseName}
                    onChange={e => setBatchForm({ ...batchForm, courseName: e.target.value })}
                  >
                    <option>Advanced Mathematics</option>
                    <option>Advanced Physics</option>
                    <option>Organic Chemistry</option>
                    <option>State CET</option>
                    <option>School Tuition</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Class Timing</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 04:00 PM - 05:30 PM"
                    className="form-input"
                    value={batchForm.timing}
                    onChange={e => setBatchForm({ ...batchForm, timing: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Faculty Member</label>
                  <select 
                    className="select-dropdown"
                    value={batchForm.teacherId}
                    onChange={e => setBatchForm({ ...batchForm, teacherId: e.target.value })}
                  >
                    <option value="">Select Instructor (Optional)</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBatchModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Batch</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Student Profile ({editStudentForm.id})</h3>
              <button className="close-btn" onClick={() => setShowEditStudentModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditStudentSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={editStudentForm.name} 
                    onChange={e => setEditStudentForm({ ...editStudentForm, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Parent Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      value={editStudentForm.parentName}
                      onChange={e => setEditStudentForm({ ...editStudentForm, parentName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent Contact Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input"
                      value={editStudentForm.parentContact}
                      onChange={e => setEditStudentForm({ ...editStudentForm, parentContact: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input"
                    value={editStudentForm.parentEmail}
                    onChange={e => setEditStudentForm({ ...editStudentForm, parentEmail: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <select 
                      className="select-dropdown"
                      value={editStudentForm.className}
                      onChange={e => setEditStudentForm({ ...editStudentForm, className: e.target.value })}
                    >
                      <option>CBSE - 10</option>
                      <option>ICSE - 10</option>
                      <option>Class 9</option>
                      <option>Class 8</option>
                      <option>Class 6-7</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course Enrolled</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input"
                      value={editStudentForm.courseEnrolled}
                      onChange={e => setEditStudentForm({ ...editStudentForm, courseEnrolled: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Smart Batch Assignment</label>
                    <select 
                      className="select-dropdown"
                      value={editStudentForm.batchId}
                      onChange={e => setEditStudentForm({ ...editStudentForm, batchId: e.target.value })}
                    >
                      <option value="">No Batch Assigned</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Course Fees (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={editStudentForm.totalFees}
                      onChange={e => setEditStudentForm({ ...editStudentForm, totalFees: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fees Paid So Far (₹)</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={editStudentForm.feesPaid}
                      onChange={e => setEditStudentForm({ ...editStudentForm, feesPaid: e.target.value })}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="form-label">Login Password / Verification PIN</label>
                  <input 
                    type="text" 
                    required
                    className="form-input"
                    value={editStudentForm.password}
                    onChange={e => setEditStudentForm({ ...editStudentForm, password: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditStudentModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {showEditTeacherModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Faculty Profile ({editTeacherForm.id})</h3>
              <button className="close-btn" onClick={() => setShowEditTeacherModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditTeacherSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Teacher Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={editTeacherForm.name}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input"
                      value={editTeacherForm.email}
                      onChange={e => setEditTeacherForm({ ...editTeacherForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input"
                      value={editTeacherForm.contact}
                      onChange={e => setEditTeacherForm({ ...editTeacherForm, contact: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Areas (Comma Separated)</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={editTeacherForm.subjects}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, subjects: e.target.value })}
                  />
                </div>
                 <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '8px' }}>Assign Batches</label>
                  {batches.length === 0 ? (
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>No active batches found. Create a batch first.</span>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(30, 34, 63, 0.03)', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', maxHeight: '120px', overflowY: 'auto' }}>
                      {batches.map(b => (
                        <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                          <input 
                            type="checkbox" 
                            checked={editTeacherForm.assignedBatches?.includes(b.id) || false}
                            onChange={() => handleEditTeacherBatchToggle(b.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          {b.name} ({b.courseName})
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="form-label">Login Password</label>
                  <input 
                    type="text" 
                    required
                    className="form-input"
                    value={editTeacherForm.password}
                    onChange={e => setEditTeacherForm({ ...editTeacherForm, password: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditTeacherModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Academic Batch Modal */}
      {showEditBatchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Academic Batch ({editBatchForm.id})</h3>
              <button className="close-btn" onClick={() => setShowEditBatchModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleEditBatchSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Batch Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={editBatchForm.name}
                    onChange={e => setEditBatchForm({ ...editBatchForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Program</label>
                  <select 
                    className="select-dropdown"
                    value={editBatchForm.courseName}
                    onChange={e => setEditBatchForm({ ...editBatchForm, courseName: e.target.value })}
                  >
                    <option>Advanced Mathematics</option>
                    <option>Advanced Physics</option>
                    <option>Organic Chemistry</option>
                    <option>State CET</option>
                    <option>School Tuition</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Class Timing</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={editBatchForm.timing}
                    onChange={e => setEditBatchForm({ ...editBatchForm, timing: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Faculty Member</label>
                  <select 
                    className="select-dropdown"
                    value={editBatchForm.teacherId}
                    onChange={e => setEditBatchForm({ ...editBatchForm, teacherId: e.target.value })}
                  >
                    <option value="">Select Instructor (Optional)</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditBatchModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Password Update Modal */}
      {showPassModal && passTarget && (
        <div className="modal-overlay" onClick={() => setShowPassModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Update Login Password</h3>
              <button className="close-btn" onClick={() => setShowPassModal(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Set a custom password/PIN for <strong>{passTarget.data.name}</strong> ({passTarget.data.id}).
              </p>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={newPassVal} 
                  onChange={e => setNewPassVal(e.target.value)} 
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-actions" style={{ marginTop: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setShowPassModal(false)}>Cancel</button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (passTarget.type === 'student') {
                      updateStudent({ ...passTarget.data, password: newPassVal.trim() });
                    } else {
                      updateTeacher({ ...passTarget.data, password: newPassVal.trim() });
                    }
                    setShowPassModal(false);
                  }}
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
