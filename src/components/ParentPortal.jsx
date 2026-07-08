import React, { useState, useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { 
  User, Calendar, BookOpen, Clipboard, MessageSquare, 
  Bell, AlertTriangle, CreditCard, Clock, Award, FileText, CheckCircle, XCircle,
  LogOut, Menu, X
} from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function ParentPortal({ studentId, onChangeStudent, onSignOut }) {
  const { 
    students, teachers, batches, announcements, attendance, grades, observations, resources 
  } = useContext(CRMContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Find child student details
  const child = students.find(s => s.id === studentId);

  if (!child) {
    return (
      <div className="empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <XCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h3 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '8px' }}>Student Profile Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', maxWidth: '360px' }}>
          No student profile is active or found in the system. Log into the Admin Portal to register students.
        </p>
        <button className="btn btn-accent-red" onClick={onSignOut} style={{ padding: '12px 24px' }}>
          Return to Portal Gateway
        </button>
      </div>
    );
  }

  // Get child's batch
  const batch = batches.find(b => b.id === child.batchId);
  
  // Get child's teacher
  const teacher = batch ? teachers.find(t => t.id === batch.teacherId) : null;

  // Get child's grades
  const childGrades = grades.filter(g => g.studentId === studentId);

  // Get child's attendance
  const childAttendanceKeys = Object.keys(attendance).filter(k => k.startsWith(`${child.batchId}_`));
  const childAttendanceLogs = childAttendanceKeys.map(key => {
    const date = key.split('_')[1];
    const status = attendance[key][studentId] || 'Absent';
    return { date, status };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  // Calculate overall attendance percentage
  const totalDays = childAttendanceLogs.length;
  const presentDays = childAttendanceLogs.filter(l => l.status === 'Present').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Get child's study resources
  const childResources = resources.filter(r => r.batchId === child.batchId);

  // Get teacher comments
  const childObservations = observations.filter(o => o.studentId === studentId);

  // Filter targeted announcements (Fee Alerts are relevant if fees aren't fully paid)
  const childAnnouncements = announcements.filter(ann => {
    if (ann.type === 'Fee' && child.feeStatus === 'Paid') return false;
    return true;
  });

  // Render SVG Attendance Ring
  const renderAttendanceRing = () => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (attendanceRate / 100) * circumference;

    return (
      <svg width="150" height="150" viewBox="0 0 150 150">
        {/* Background track circle */}
        <circle 
          cx="75" 
          cy="75" 
          r={radius} 
          fill="transparent" 
          stroke="var(--border-color)" 
          strokeWidth="10" 
        />
        {/* Active glowing progress circle */}
        <circle 
          cx="75" 
          cy="75" 
          r={radius} 
          fill="transparent" 
          stroke={attendanceRate >= 80 ? 'var(--color-success)' : 'var(--color-warning)'} 
          strokeWidth="10" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 0.8s ease', 
            transform: 'rotate(-90deg)', 
            transformOrigin: '75px 75px' 
          }}
        />
        <text 
          x="75" 
          y="80" 
          textAnchor="middle" 
          fill="#fff" 
          fontSize="22" 
          fontWeight="700"
          fontFamily="var(--font-family)"
        >
          {attendanceRate}%
        </text>
        <text 
          x="75" 
          y="100" 
          textAnchor="middle" 
          fill="var(--text-secondary)" 
          fontSize="10"
          fontWeight="500"
          letterSpacing="0.05em"
          fontFamily="var(--font-family)"
        >
          ATTENDANCE
        </text>
      </svg>
    );
  };

  // Render SVG Grade Progress Line Chart
  const renderGradeChart = () => {
    if (childGrades.length === 0) {
      return (
        <div className="empty-state" style={{ padding: '20px' }}>
          <Award className="empty-state-icon" style={{ fontSize: '2rem' }} />
          <p>No academic grades published yet.</p>
        </div>
      );
    }

    // Sort grades chronologically
    const sorted = [...childGrades].sort((a, b) => new Date(a.date) - new Date(b.date));
    const percentages = sorted.map(g => (g.score / g.maxScore) * 100);

    const width = 360;
    const height = 150;
    const padding = 30;

    // Calculate coordinates
    const points = sorted.map((g, idx) => {
      const x = padding + (idx * (width - 2 * padding) / Math.max(sorted.length - 1, 1));
      const pct = percentages[idx];
      const y = height - padding - (pct / 100) * (height - 2 * padding);
      return { x, y, label: g.examName, value: `${Math.round(pct)}%` };
    });

    const dPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div className="chart-container" style={{ height: '170px' }}>
        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
          {/* Horizontal Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="chart-grid-line" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} className="chart-grid-line" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" />

          {/* Area shade */}
          {points.length > 0 && (
            <path 
              d={`${dPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`} 
              className="chart-line-bg"
            />
          )}

          {/* Line */}
          <path d={dPath} className="chart-line" strokeWidth="2.5" />

          {/* Point nodes */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="var(--color-secondary)" style={{ cursor: 'pointer' }} />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">{p.value}</text>
              <text x={p.x} y={height - padding + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="7" fontWeight="500">
                {p.label.split(':')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

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
          <span className="portal-badge" style={{ marginLeft: '12px' }}>Parent Dashboard</span>
        </div>
        <div className="portal-header-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="form-label" style={{ margin: 0, fontSize: '0.85rem' }}>Student Profile:</span>
            <select 
              value={studentId} 
              onChange={(e) => onChangeStudent(e.target.value)}
              className="select-dropdown"
              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
              ))}
            </select>
          </div>

          <div className="user-avatar-wrap">
            <div className="user-avatar-badge" title={child?.name}>
              {getInitials(child?.name)}
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
          <h4>{child.name}</h4>
          <span>{child.className}</span>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <User size={18} />
            Student Overview
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'scores' ? 'active' : ''}`}
            onClick={() => { setActiveTab('scores'); setIsSidebarOpen(false); }}
          >
            <Award size={18} />
            Academic Grades
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}
          >
            <Calendar size={18} />
            Attendance Records
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => { setActiveTab('materials'); setIsSidebarOpen(false); }}
          >
            <BookOpen size={18} />
            Study Materials
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }}
          >
            <MessageSquare size={18} />
            Teacher Remarks
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('alerts'); setIsSidebarOpen(false); }}
          >
            <Bell size={18} />
            Circulars & Alerts
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="crm-main fade-in">
        <div className="panel-header">
          <h2 className="panel-title">
            {activeTab === 'overview' && 'Student Performance Overview'}
            {activeTab === 'scores' && 'Academic Performance Portfolio'}
            {activeTab === 'attendance' && 'Daily Attendance & Metrics'}
            {activeTab === 'materials' && 'Topic-wise Resources & Homework'}
            {activeTab === 'feedback' && 'Teacher Observation Logs'}
            {activeTab === 'alerts' && 'Official Institutional Circulars'}
          </h2>
        </div>

        {/* Tab Contents */}

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Warning Alerts */}
            {child.feeStatus !== 'Paid' && (
              <div style={{
                background: 'rgba(255, 23, 68, 0.12)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                padding: '16px',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertTriangle color="var(--color-danger)" />
                <div>
                  <span style={{ fontWeight: 600, color: '#fff' }}>Pending Dues Alert: </span>
                  Your child's fee status is marked as <span className="badge badge-danger">{child.feeStatus}</span>. Please clear outstanding installments by logging into the portal payment gateway.
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Profile details */}
              <div className="crm-card">
                <h3 className="crm-card-title"><User size={18} color="var(--color-primary)" /> Profile Particulars</h3>
                <div className="profile-meta-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Reg ID</span>
                    <span className="profile-meta-val" style={{ color: 'var(--color-secondary)' }}>{child.id}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Admission Date</span>
                    <span className="profile-meta-val">{child.admissionDate}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Parent / Guardian</span>
                    <span className="profile-meta-val">{child.parentName}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Contact No</span>
                    <span className="profile-meta-val">{child.parentContact}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Email Address</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{child.parentEmail}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Fee Status</span>
                    <span className={`badge ${child.feeStatus === 'Paid' ? 'badge-success' : child.feeStatus === 'Partial' ? 'badge-warning' : 'badge-danger'}`} style={{ alignSelf: 'flex-start' }}>
                      {child.feeStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course details */}
              <div className="crm-card">
                <h3 className="crm-card-title"><BookOpen size={18} color="var(--color-secondary)" /> Academic Course Mapping</h3>
                <div className="profile-meta-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Enrolled Course</span>
                    <span className="profile-meta-val">{child.courseEnrolled}</span>
                  </div>
                  <div className="profile-meta-item" style={{ marginTop: '8px' }}>
                    <span className="profile-meta-label">Assigned Batch</span>
                    <span className="profile-meta-val">{batch ? `${batch.name} (${batch.timing})` : 'Unassigned'}</span>
                  </div>
                  {teacher && (
                    <div className="profile-meta-item" style={{ marginTop: '8px' }}>
                      <span className="profile-meta-label">Class Instructor</span>
                      <span className="profile-meta-val">{teacher.name} ({teacher.email})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grade Curve Chart */}
            <div className="crm-card">
              <h3 className="crm-card-title"><Award size={18} color="var(--color-primary)" /> Grade Curve</h3>
              {renderGradeChart()}
            </div>
          </>
        )}

        {/* Tab: Scores */}
        {activeTab === 'scores' && (
          <div className="learning-curve-grid">
            <div className="crm-card">
              <h3 className="crm-card-title"><Award size={18} color="var(--color-secondary)" /> Academic Exam Grades</h3>
              <div className="table-wrapper">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Exam / Assessment</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childGrades.length > 0 ? (
                      childGrades.map(g => (
                        <tr key={g.id}>
                          <td style={{ fontWeight: 500 }}>{g.examName}</td>
                          <td>{g.subject}</td>
                          <td><span className="badge badge-info">{g.score} / {g.maxScore}</span></td>
                          <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                            {Math.round((g.score / g.maxScore) * 100)}%
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{g.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No grade logs registered for this student yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="crm-card">
              <h3 className="crm-card-title"><MessageSquare size={18} color="var(--color-primary)" /> Academic Feedback</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {childGrades.filter(g => g.feedback).map(g => (
                  <div key={g.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{g.examName}</div>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '6px' }}>
                      "{g.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Attendance */}
        {activeTab === 'attendance' && (
          <div className="crm-card">
            <h3 className="crm-card-title"><Clock size={18} color="var(--color-info)" /> Historical Attendance Logs</h3>
            <div className="table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Class Session</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {childAttendanceLogs.length > 0 ? (
                    childAttendanceLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.date}</td>
                        <td>{child.courseEnrolled}</td>
                        <td>
                          {log.status === 'Present' ? (
                            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              <CheckCircle size={10} /> Present
                            </span>
                          ) : (
                            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              <XCircle size={10} /> Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No daily attendance logs mapped for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Study Materials */}
        {activeTab === 'materials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="crm-card">
              <h3 className="crm-card-title"><BookOpen size={18} color="var(--color-primary)" /> Topic-wise Lesson Materials & Homework</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {childResources.length > 0 ? (
                  childResources.map(r => (
                    <div key={r.id} className="notification-item">
                      <div className="notification-badge-wrapper">
                        <span className={`badge ${r.type === 'Homework' ? 'badge-danger' : 'badge-info'}`}>{r.type}</span>
                        <span className="notification-date">Uploaded: {r.date}</span>
                      </div>
                      <div className="notification-title">{r.title}</div>
                      <div className="notification-body">{r.description}</div>
                      <a href={r.link} className="btn btn-secondary" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '0.8rem', marginTop: '6px' }}>
                        View / Download Document Resource
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <BookOpen className="empty-state-icon" />
                    <h3>No distributed resources</h3>
                    <p>There are no active study notes or assignments shared for this batch.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Teacher Remarks */}
        {activeTab === 'feedback' && (
          <div className="crm-card">
            <h3 className="crm-card-title"><MessageSquare size={18} color="var(--color-secondary)" /> School Observations & PTM Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {childObservations.length > 0 ? (
                childObservations.map(obs => (
                  <div key={obs.id} className="notification-item">
                    <div className="notification-badge-wrapper">
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>Logged by {obs.teacherName}</span>
                      <span className="notification-date">{obs.date}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', fontStyle: 'italic', margin: '4px 0', color: 'var(--text-primary)' }}>
                      "{obs.feedback}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FileText className="empty-state-icon" />
                  <h3>No teacher observations logged</h3>
                  <p>Your child has clean records. No special behavior alerts logged by the faculty.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Alerts & Circulars */}
        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {childAnnouncements.map(ann => (
              <div key={ann.id} className="notification-item">
                <div className="notification-badge-wrapper">
                  <span className={`notification-type ${ann.type.toLowerCase()}`}>{ann.type}</span>
                  <span className="notification-date">{ann.date}</span>
                </div>
                <div className="notification-title">{ann.title}</div>
                <div className="notification-body">{ann.content}</div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
