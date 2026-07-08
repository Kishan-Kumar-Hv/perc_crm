import React, { useState, useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { 
  Users, UserCheck, LayoutDashboard, Bookmark, Bell, Plus, Trash2, 
  Search, TrendingUp, DollarSign, Calendar, Sliders, ChevronRight, ChevronLeft, ArrowRightLeft,
  LogOut, Menu, X, BookOpen
} from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function AdminPortal({ onSignOut }) {
  const { 
    students, teachers, batches, announcements, 
    addStudent, updateStudent, deleteStudent, 
    addTeacher, deleteTeacher, 
    addAnnouncement, deleteAnnouncement,
    addBatch, deleteBatch
  } = useContext(CRMContext);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Search/Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterBatch, setStudentFilterBatch] = useState('');

  // Form states
  const [batchForm, setBatchForm] = useState({
    name: '', courseName: 'Advanced Mathematics', timing: '', teacherId: ''
  });
  const [studentForm, setStudentForm] = useState({
    name: '', parentName: '', parentContact: '', parentEmail: '',
    className: 'Grade 10', courseEnrolled: 'Advanced Mathematics',
    batchId: '', feeStatus: 'Paid'
  });
  const [teacherForm, setTeacherForm] = useState({
    name: '', email: '', contact: '', subjects: '', assignedBatches: []
  });
  const [annForm, setAnnForm] = useState({
    type: 'Holiday', title: '', content: ''
  });

  // KPI Calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalBatches = batches.length;
  
  // Paid/Unpaid Stats
  const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
  const partialCount = students.filter(s => s.feeStatus === 'Partial').length;
  const overdueCount = students.filter(s => s.feeStatus === 'Overdue').length;

  // Render SVG Demographic Chart
  const renderDemographicChart = () => {
    const counts = { 'Grade 10': 0, 'Grade 11': 0, 'Grade 12': 0 };
    students.forEach(s => {
      if (counts[s.className] !== undefined) {
        counts[s.className]++;
      }
    });

    const maxVal = Math.max(...Object.values(counts), 1);
    const data = Object.entries(counts);

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 400 200">
          {/* Grid lines */}
          <line x1="40" y1="30" x2="380" y2="30" className="chart-grid-line" />
          <line x1="40" y1="80" x2="380" y2="80" className="chart-grid-line" />
          <line x1="40" y1="130" x2="380" y2="130" className="chart-grid-line" />
          <line x1="40" y1="170" x2="380" y2="170" stroke="var(--border-color)" strokeWidth="2" />

          {data.map(([label, val], idx) => {
            const barWidth = 45;
            const barSpacing = 100;
            const x = 70 + idx * barSpacing;
            const height = (val / maxVal) * 120;
            const y = 170 - height;
            
            return (
              <g key={label}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={height} 
                  rx="6" 
                  className="chart-bar"
                />
                <text x={x + barWidth/2} y={y - 8} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
                  {val}
                </text>
                <text x={x + barWidth/2} y="185" textAnchor="middle" className="chart-axis-text">
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
    // Generate static values based on mock database dates
    const data = [
      { date: '07-01', rate: 80 },
      { date: '07-02', rate: 85 },
      { date: '07-03', rate: 75 }
    ];

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox="0 0 400 200">
          <line x1="40" y1="30" x2="380" y2="30" className="chart-grid-line" />
          <line x1="40" y1="90" x2="380" y2="90" className="chart-grid-line" />
          <line x1="40" y1="150" x2="380" y2="150" className="chart-grid-line" />
          <line x1="40" y1="170" x2="380" y2="170" stroke="var(--border-color)" />

          {/* Area under line */}
          <path 
            d="M 60 170 L 60 74 L 200 66 L 340 82 L 340 170 Z" 
            className="chart-line-bg"
          />

          {/* Line path */}
          <path 
            d="M 60 74 L 200 66 L 340 82" 
            className="chart-line"
          />

          {/* Points */}
          <circle cx="60" cy="74" r="5" fill="var(--color-secondary)" />
          <text x="60" y="58" textAnchor="middle" fill="#fff" fontSize="10">80%</text>
          <text x="60" y="185" textAnchor="middle" className="chart-axis-text">Jul 01</text>

          <circle cx="200" cy="66" r="5" fill="var(--color-secondary)" />
          <text x="200" y="50" textAnchor="middle" fill="#fff" fontSize="10">85%</text>
          <text x="200" y="185" textAnchor="middle" className="chart-axis-text">Jul 02</text>

          <circle cx="340" cy="82" r="5" fill="var(--color-secondary)" />
          <text x="340" y="66" textAnchor="middle" fill="#fff" fontSize="10">75%</text>
          <text x="340" y="185" textAnchor="middle" className="chart-axis-text">Jul 03</text>

          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  // Student Actions
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    addStudent(studentForm);
    setStudentForm({
      name: '', parentName: '', parentContact: '', parentEmail: '',
      className: 'Grade 10', courseEnrolled: 'Advanced Mathematics',
      batchId: '', feeStatus: 'Paid'
    });
    setShowStudentModal(false);
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
      assignedBatches: teacherForm.assignedBatches
    });

    setTeacherForm({ name: '', email: '', contact: '', subjects: '', assignedBatches: [] });
    setShowTeacherModal(false);
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
                Fee Payment Collections
              </h3>
              <div className="profile-meta-grid">
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
                  <span className="profile-meta-label">Collection Rate</span>
                  <span className="profile-meta-val" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                    {((paidCount + (partialCount * 0.5)) / totalStudents * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
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

            {/* Students Table */}
            <div className="table-wrapper">
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
                            <span className={`badge ${
                              student.feeStatus === 'Paid' ? 'badge-success' : 
                              student.feeStatus === 'Partial' ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {student.feeStatus}
                            </span>
                          </td>
                          <td>
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
          </>
        )}

        {activeTab === 'teachers' && (
          <div className="table-wrapper">
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
              <div className="table-responsive">
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
                      <option>Grade 10</option>
                      <option>Grade 11</option>
                      <option>Grade 12</option>
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
                    <label className="form-label">Fee Installment Status</label>
                    <select 
                      className="select-dropdown"
                      value={studentForm.feeStatus}
                      onChange={e => setStudentForm({ ...studentForm, feeStatus: e.target.value })}
                    >
                      <option>Paid</option>
                      <option>Partial</option>
                      <option>Overdue</option>
                    </select>
                  </div>
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
      </div>
    </div>
  );
}
