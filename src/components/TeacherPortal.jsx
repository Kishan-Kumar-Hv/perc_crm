import React, { useState, useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { 
  BookOpen, Calendar, CheckSquare, FileText, ClipboardList, 
  MessageSquare, Plus, Check, X, BookOpenCheck, ExternalLink, CalendarDays,
  LogOut, Menu, XCircle
} from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function TeacherPortal({ teacherId, onChangeTeacher, onSignOut }) {
  const { 
    students, teachers, batches, attendance, grades, observations, resources,
    saveAttendance, saveGrade, addObservation, addResource, showToast
  } = useContext(CRMContext);

  const [activeTab, setActiveTab] = useState('schedule');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'T';
    const parts = name.replace(/Dr\.|Prof\.|Mrs\.|Mr\./g, '').trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  // Find current teacher
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) {
    return (
      <div className="empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <XCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '8px' }}>Teacher Profile Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', maxWidth: '360px' }}>
          No teacher profile is active or found in the system. Log into the Admin Portal to add faculty members.
        </p>
        <button className="btn btn-accent-red" onClick={onSignOut} style={{ padding: '12px 24px' }}>
          Return to Portal Gateway
        </button>
      </div>
    );
  }

  // Get batches assigned to this teacher
  const teacherBatches = React.useMemo(() => {
    return batches.filter(b => b.teacherId === teacherId || (teacher?.assignedBatches && teacher.assignedBatches.includes(b.id)));
  }, [batches, teacherId, teacher]);

  // Active state for Attendance
  const [selectedAttendanceBatch, setSelectedAttendanceBatch] = useState(teacherBatches[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeAttendanceState, setActiveAttendanceState] = useState({});

  // Sync loaded attendance from context if available
  const handleLoadAttendance = () => {
    if (!selectedAttendanceBatch) return;
    const key = `${selectedAttendanceBatch}_${attendanceDate}`;
    const saved = attendance[key] || {};
    
    // Get all students in this batch
    const batchStudents = students.filter(s => s.batchId === selectedAttendanceBatch);
    const initial = {};
    batchStudents.forEach(s => {
      initial[s.id] = saved[s.id] || 'Present'; // default to Present
    });
    setActiveAttendanceState(initial);
  };

  // Initialize/Load attendance on load or dependency change
  React.useEffect(() => {
    handleLoadAttendance();
  }, [selectedAttendanceBatch, attendanceDate, attendance]);

  const handleStatusChange = (studentId, status) => {
    setActiveAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendanceSubmit = () => {
    saveAttendance(selectedAttendanceBatch, attendanceDate, activeAttendanceState);
    showToast('Attendance records saved successfully.', 'success');
  };

  // State for Grades Entry
  const [selectedGradeBatch, setSelectedGradeBatch] = useState(teacherBatches[0]?.id || '');
  const [selectedGradeStudent, setSelectedGradeStudent] = useState('');
  const [gradeForm, setGradeForm] = useState({
    subject: teacher.subjects[0] || '', examName: '', score: '', maxScore: 100, feedback: ''
  });

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedGradeStudent) {
      showToast('Please select a student.', 'warning');
      return;
    }
    saveGrade({
      studentId: selectedGradeStudent,
      batchId: selectedGradeBatch,
      subject: gradeForm.subject,
      examName: gradeForm.examName,
      score: parseFloat(gradeForm.score),
      maxScore: parseFloat(gradeForm.maxScore),
      feedback: gradeForm.feedback
    });
    setGradeForm({
      subject: teacher.subjects[0] || '', examName: '', score: '', maxScore: 100, feedback: ''
    });
    showToast('Academic score registered successfully.', 'success');
  };

  // State for Resource Upload
  const [selectedResBatch, setSelectedResBatch] = useState(teacherBatches[0]?.id || '');
  const [resForm, setResForm] = useState({
    title: '', type: 'Study Material', description: '', link: ''
  });

  const handleResourceSubmit = (e) => {
    e.preventDefault();
    addResource({
      batchId: selectedResBatch,
      title: resForm.title,
      type: resForm.type,
      description: resForm.description,
      link: resForm.link
    });
    setResForm({ title: '', type: 'Study Material', description: '', link: '' });
    showToast('Classroom resource uploaded successfully.', 'success');
  };

  // State for Subjective Observations
  const [selectedObsStudent, setSelectedObsStudent] = useState('');
  const [obsFeedback, setObsFeedback] = useState('');

  const handleObsSubmit = (e) => {
    e.preventDefault();
    if (!selectedObsStudent) {
      showToast('Please select a student.', 'warning');
      return;
    }
    addObservation(selectedObsStudent, teacher.name, obsFeedback);
    setObsFeedback('');
    setSelectedObsStudent('');
    showToast('Teacher observation logged successfully.', 'success');
  };

  // Auto-select first batch when batches are loaded/changed
  React.useEffect(() => {
    if (teacherBatches.length > 0) {
      if (!selectedAttendanceBatch || !teacherBatches.some(b => b.id === selectedAttendanceBatch)) {
        setSelectedAttendanceBatch(teacherBatches[0].id);
      }
      if (!selectedGradeBatch || !teacherBatches.some(b => b.id === selectedGradeBatch)) {
        setSelectedGradeBatch(teacherBatches[0].id);
      }
      if (!selectedResBatch || !teacherBatches.some(b => b.id === selectedResBatch)) {
        setSelectedResBatch(teacherBatches[0].id);
      }
    }
  }, [teacherBatches, selectedAttendanceBatch, selectedGradeBatch, selectedResBatch]);

  // All student options in teacher's batches
  const teacherStudents = students.filter(s => teacherBatches.some(tb => tb.id === s.batchId));

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
          <span className="portal-badge" style={{ marginLeft: '12px' }}>Teacher Workspace</span>
        </div>
        <div className="portal-header-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>Instructor:</span>
            <select 
              value={teacherId} 
              onChange={(e) => onChangeTeacher(e.target.value)}
              className="select-dropdown"
              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div className="user-avatar-wrap">
            <div className="user-avatar-badge" title={teacher.name}>
              {getInitials(teacher.name)}
              <span className="active-dot"></span>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={onSignOut} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <LogOut size={14} /> <span className="hide-on-mobile">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="crm-layout" style={{ flexGrow: 1, minHeight: 'unset' }}>
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
        )}
      {/* Sidebar */}
      <aside className={`crm-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h4>{teacher.name}</h4>
          <span>{teacher.email}</span>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => { setActiveTab('schedule'); setIsSidebarOpen(false); }}
          >
            <Calendar size={18} />
            My Batches
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}
          >
            <CheckSquare size={18} />
            Attendance Book
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => { setActiveTab('grades'); setIsSidebarOpen(false); }}
          >
            <ClipboardList size={18} />
            Exam Grades
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => { setActiveTab('resources'); setIsSidebarOpen(false); }}
          >
            <BookOpen size={18} />
            Study Materials
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'observations' ? 'active' : ''}`}
            onClick={() => { setActiveTab('observations'); setIsSidebarOpen(false); }}
          >
            <MessageSquare size={18} />
            Observations Log
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="crm-main fade-in">
        <div className="panel-header">
          <h2 className="panel-title">
            {activeTab === 'schedule' && 'Assigned Batch Schedules'}
            {activeTab === 'attendance' && 'Digital Attendance Registry'}
            {activeTab === 'grades' && 'Academic Performance Grading'}
            {activeTab === 'resources' && 'Lecture Note & Material Repository'}
            {activeTab === 'observations' && 'Student Observation Logs'}
          </h2>
        </div>

        {/* Tab Contents */}
        
        {/* Tab: Schedule */}
        {activeTab === 'schedule' && (
          <div className="dashboard-grid">
            {teacherBatches.length > 0 ? (
              teacherBatches.map(b => {
                const batchStudents = students.filter(s => s.batchId === b.id);
                return (
                  <div key={b.id} className="crm-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{b.name}</h3>
                      <span className="badge badge-info">{b.id}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      <div className="lead-meta"><CalendarDays size={14} /> {b.timing}</div>
                      <div className="lead-meta"><BookOpenCheck size={14} /> {b.courseName}</div>
                      <div className="lead-meta"><ClipboardList size={14} /> {batchStudents.length} Students Assigned</div>
                    </div>
                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Roster:</div>
                      <ul style={{ listStyle: 'none', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {batchStudents.map(s => (
                          <li key={s.id} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.name} ({s.id})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <Calendar className="empty-state-icon" />
                <h3>No Batches Assigned</h3>
                <p>Currently, you do not have any active batches assigned by the administration.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Attendance */}
        {activeTab === 'attendance' && (
          <>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flexGrow: 1 }}>
                <label className="form-label">Select Batch</label>
                <select 
                  className="select-dropdown" 
                  value={selectedAttendanceBatch}
                  onChange={e => setSelectedAttendanceBatch(e.target.value)}
                >
                  <option value="">-- Choose Batch --</option>
                  {teacherBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attendance Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                />
              </div>
            </div>

            {selectedAttendanceBatch ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="attendance-grid">
                  {students.filter(s => s.batchId === selectedAttendanceBatch).map(student => {
                    const status = activeAttendanceState[student.id] || 'Present';
                    return (
                      <div key={student.id} className={`attendance-card ${status.toLowerCase()}`} style={{
                        padding: '20px 16px',
                        borderRadius: 'var(--border-radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FFFFFF',
                        border: `1.5px solid ${status === 'Present' ? 'rgba(16, 185, 129, 0.4)' : status === 'Absent' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                        boxShadow: status === 'Present' ? '0 8px 20px rgba(16, 185, 129, 0.08)' : status === 'Absent' ? '0 8px 20px rgba(239, 68, 68, 0.08)' : 'var(--shadow-premium)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        <div className="student-avatar" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: status === 'Present' ? 'var(--color-success-bg)' : status === 'Absent' ? 'var(--color-danger-bg)' : 'rgba(30, 34, 63, 0.04)',
                          color: status === 'Present' ? 'var(--color-success)' : status === 'Absent' ? 'var(--color-danger)' : 'var(--color-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          border: `1.5px solid ${status === 'Present' ? 'var(--color-success)' : status === 'Absent' ? 'var(--color-danger)' : 'transparent'}`,
                          transition: 'all 0.25s ease'
                        }}>
                          {getInitials(student.name)}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div className="attendance-name" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{student.id}</div>
                        </div>
                        
                        <div className="attendance-buttons" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                          <button 
                            type="button"
                            className={`att-btn ${status === 'Present' ? 'present-active' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              borderRadius: 'var(--border-radius-sm)',
                              border: '1.5px solid var(--border-color)',
                              background: '#FFFFFF',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease',
                              ...(status === 'Present' ? {
                                background: 'var(--color-success)',
                                color: '#FFFFFF',
                                borderColor: 'var(--color-success)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                              } : {})
                            }}
                          >
                            <Check size={12} /> Present
                          </button>
                          <button 
                            type="button"
                            className={`att-btn ${status === 'Absent' ? 'absent-active' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              borderRadius: 'var(--border-radius-sm)',
                              border: '1.5px solid var(--border-color)',
                              background: '#FFFFFF',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease',
                              ...(status === 'Absent' ? {
                                background: 'var(--color-danger)',
                                color: '#FFFFFF',
                                borderColor: 'var(--color-danger)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                              } : {})
                            }}
                          >
                            <X size={12} /> Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="btn btn-primary" onClick={handleSaveAttendanceSubmit} style={{ alignSelf: 'flex-start' }}>
                  <Check size={16} /> Save Attendance Records
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <CheckSquare className="empty-state-icon" />
                <h3>Select a batch to record attendance</h3>
              </div>
            )}
          </>
        )}

        {/* Tab: Grades */}
        {activeTab === 'grades' && (
          <div className="learning-curve-grid">
            {/* Form to submit grades */}
            <div className="crm-card">
              <h3 className="crm-card-title">
                <Plus size={18} color="var(--color-secondary)" />
                Register New Score Entry
              </h3>
              <form onSubmit={handleGradeSubmit}>
                <div className="form-group">
                  <label className="form-label">Batch Group</label>
                  <select 
                    className="select-dropdown"
                    value={selectedGradeBatch}
                    onChange={e => {
                      setSelectedGradeBatch(e.target.value);
                      setSelectedGradeStudent('');
                    }}
                  >
                    {teacherBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <select 
                    className="select-dropdown"
                    required
                    value={selectedGradeStudent}
                    onChange={e => setSelectedGradeStudent(e.target.value)}
                  >
                    <option value="">-- Select Student --</option>
                    {students.filter(s => s.batchId === selectedGradeBatch).map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Area</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    value={gradeForm.subject}
                    onChange={e => setGradeForm({ ...gradeForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Exam / Quiz Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Mid-term Assessment, Homework 3"
                    className="form-input"
                    value={gradeForm.examName}
                    onChange={e => setGradeForm({ ...gradeForm, examName: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Obtained Score</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={gradeForm.score}
                      onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Maximum Total Score</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={gradeForm.maxScore}
                      onChange={e => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subjective Performance Remarks</label>
                  <textarea 
                    className="form-input"
                    placeholder="Provide constructive feedback for student improvement..."
                    rows="3"
                    value={gradeForm.feedback}
                    onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Publish Score Card
                </button>
              </form>
            </div>

            {/* List of graded students */}
            <div className="crm-card">
              <h3 className="crm-card-title">
                <ClipboardList size={18} color="var(--color-primary)" />
                Recent Graded Submissions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {grades.filter(g => teacherBatches.some(tb => tb.id === g.batchId)).map(g => {
                  const student = students.find(s => s.id === g.studentId);
                  return (
                    <div key={g.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student ? student.name : g.studentId}</span>
                        <span className="badge badge-success">{g.score} / {g.maxScore}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {g.examName} | <span style={{ color: 'var(--color-secondary)' }}>{g.subject}</span>
                      </div>
                      {g.feedback && (
                        <p style={{ fontSize: '0.85rem', marginTop: '6px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          "{g.feedback}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Resources */}
        {activeTab === 'resources' && (
          <div className="learning-curve-grid">
            <div className="crm-card">
              <h3 className="crm-card-title">
                <Plus size={18} color="var(--color-secondary)" />
                Add Lecture Note or Homework
              </h3>
              <form onSubmit={handleResourceSubmit}>
                <div className="form-group">
                  <label className="form-label">Target Batch Group</label>
                  <select 
                    className="select-dropdown"
                    value={selectedResBatch}
                    onChange={e => setSelectedResBatch(e.target.value)}
                  >
                    {teacherBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Resource Type</label>
                  <select 
                    className="select-dropdown"
                    value={resForm.type}
                    onChange={e => setResForm({ ...resForm, type: e.target.value })}
                  >
                    <option>Study Material</option>
                    <option>Homework</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Material / Assignment Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Organic Chemistry Carbon Atoms Worksheet"
                    className="form-input"
                    value={resForm.title}
                    onChange={e => setResForm({ ...resForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Document Link (optional URL)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. drive.google.com/resources/123"
                    className="form-input"
                    value={resForm.link}
                    onChange={e => setResForm({ ...resForm, link: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Notes / Descriptions</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    required
                    placeholder="Specify reading instructions, reference pages, or submission guidelines..."
                    value={resForm.description}
                    onChange={e => setResForm({ ...resForm, description: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Distribute Material
                </button>
              </form>
            </div>

            <div className="crm-card">
              <h3 className="crm-card-title">
                <BookOpen size={18} color="var(--color-primary)" />
                Shared Resource Repository
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {resources.filter(r => teacherBatches.some(tb => tb.id === r.batchId)).map(r => {
                  const targetBatch = batches.find(b => b.id === r.batchId);
                  return (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{r.title}</span>
                        <span className={`badge ${r.type === 'Homework' ? 'badge-danger' : 'badge-info'}`}>{r.type}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', margin: '6px 0' }}>{r.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Target: {targetBatch ? targetBatch.name : r.batchId}</span>
                        <a href={r.link} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-secondary)', textDecoration: 'none' }}>
                          Open File <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Observations */}
        {activeTab === 'observations' && (
          <div className="learning-curve-grid">
            <div className="crm-card">
              <h3 className="crm-card-title">
                <MessageSquare size={18} color="var(--color-secondary)" />
                Record Student Observation Log
              </h3>
              <form onSubmit={handleObsSubmit}>
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select 
                    className="select-dropdown"
                    required
                    value={selectedObsStudent}
                    onChange={e => setSelectedObsStudent(e.target.value)}
                  >
                    <option value="">-- Choose Student --</option>
                    {teacherStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subjective Observation & Feedback</label>
                  <textarea 
                    className="form-input"
                    rows="5"
                    required
                    placeholder="Log comments about student engagement, strengths, areas needing support, behavior metrics, or PTM requirements..."
                    value={obsFeedback}
                    onChange={e => setObsFeedback(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Log Observation Details
                </button>
              </form>
            </div>

            <div className="crm-card">
              <h3 className="crm-card-title">
                <FileText size={18} color="var(--color-primary)" />
                Historical Observation Logs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {observations.filter(o => teacherStudents.some(ts => ts.id === o.studentId)).map(obs => {
                  const student = students.find(s => s.id === obs.studentId);
                  return (
                    <div key={obs.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{student ? student.name : obs.studentId}</span>
                        <span className="notification-date">{obs.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                        "{obs.feedback}"
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                        Log by {obs.teacherName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
