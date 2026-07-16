import React, { useState, useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { 
  User, Calendar, BookOpen, Clipboard, MessageSquare, 
  Bell, AlertTriangle, CreditCard, Clock, Award, FileText, CheckCircle, XCircle,
  LogOut, Menu, X, ChevronDown, ChevronUp
} from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function ParentPortal({ studentId, onChangeStudent, onSignOut }) {
  const { 
    students, teachers, batches, announcements, attendance, grades, observations, resources 
  } = useContext(CRMContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedGradeId, setExpandedGradeId] = useState(null);
  const [hoveredGradePoint, setHoveredGradePoint] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState('all');

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

  // Calculate dynamic fee status
  const feesPaid = child.feesPaid || 0;
  const totalFees = child.totalFees || 0;
  const feeStatus = feesPaid >= totalFees && totalFees > 0 ? 'Paid' : (feesPaid > 0 ? 'Partial' : 'Unpaid');

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

  const filteredLogs = childAttendanceLogs.filter(log => {
    if (attendanceFilter === 'all') return true;
    return log.status.toLowerCase() === attendanceFilter;
  });

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
    if (ann.type === 'Fee' && feeStatus === 'Paid') return false;
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
          fill="var(--color-primary)" 
          fontSize="22" 
          fontWeight="700"
          fontFamily="var(--font-family)"
        >
          {attendanceRate}%
        </text>
        <text 
          x="75" 
          y="98" 
          textAnchor="middle" 
          fill="var(--text-muted)" 
          fontSize="8"
          fontWeight="700"
          letterSpacing="0.08em"
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
      return { x, y, label: g.examName, value: `${Math.round(pct)}%`, score: g.score, maxScore: g.maxScore, date: g.date, feedback: g.feedback };
    });

    const dPath = getBezierPath(points);
    const dArea = points.length > 0 ? `${dPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : '';

    return (
      <div className="chart-container" style={{ height: '170px', position: 'relative' }}>
        {/* Tooltip Overlay */}
        {hoveredGradePoint && (
          <div 
            className="chart-tooltip" 
            style={{ 
              left: `${hoveredGradePoint.x}px`, 
              top: `${hoveredGradePoint.y - 70}px`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              opacity: 1
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)' }}>{hoveredGradePoint.label}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
              Score: <strong style={{ color: 'var(--color-primary)' }}>{hoveredGradePoint.score}/{hoveredGradePoint.maxScore} ({hoveredGradePoint.value})</strong>
            </div>
            {hoveredGradePoint.feedback && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                "{hoveredGradePoint.feedback}"
              </div>
            )}
          </div>
        )}

        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="chart-grid-line" strokeWidth="0.5" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} className="chart-grid-line" strokeWidth="0.5" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />

          {/* Area shade */}
          {points.length > 0 && (
            <path 
              d={dArea} 
              className="chart-line-bg"
            />
          )}

          {/* Smooth line */}
          <path d={dPath} className="chart-line" strokeWidth="2.5" />

          {/* Point nodes */}
          {points.map((p, idx) => {
            const isHovered = hoveredGradePoint && hoveredGradePoint.idx === idx;
            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredGradePoint({ ...p, idx })}
                onMouseLeave={() => setHoveredGradePoint(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring */}
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 8 : 4.5} 
                  fill="var(--color-secondary)" 
                  opacity={isHovered ? 0.35 : 0}
                  style={{ transition: 'r 0.15s ease, opacity 0.15s ease' }}
                />
                {/* Center dot */}
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
                  fontSize="7.5" 
                  fontWeight="700"
                >
                  {p.value}
                </text>
                <text 
                  x={p.x} 
                  y={height - padding + 12} 
                  textAnchor="middle" 
                  fill="var(--text-muted)" 
                  fontSize="7" 
                  fontWeight="500"
                >
                  {p.label.split(':')[0]}
                </text>
              </g>
            );
          })}
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
            {feeStatus !== 'Paid' && (
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
                <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Pending Dues Alert: </span>
                  Your child's fee status is marked as <span className={`badge ${feeStatus === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>{feeStatus}</span>. Please clear outstanding installments by logging into the portal payment gateway.
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Profile details */}
              <div className="crm-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div className="avatar-circle" style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 10px rgba(30, 34, 63, 0.12)'
                  }}>
                    {getInitials(child.name)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--color-primary)' }}>{child.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {child.id}</span>
                  </div>
                </div>
                
                <div className="profile-meta-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Admission Date</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{child.admissionDate}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Class Year</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{child.className}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Parent / Guardian</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{child.parentName}</span>
                  </div>
                  <div className="profile-meta-item">
                    <span className="profile-meta-label">Contact No</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{child.parentContact}</span>
                  </div>
                  <div className="profile-meta-item" style={{ gridColumn: 'span 2' }}>
                    <span className="profile-meta-label">Registered Email</span>
                    <span className="profile-meta-val" style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>{child.parentEmail}</span>
                  </div>
                </div>
              </div>

              {/* Course details */}
              <div className="crm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="crm-card-title" style={{ margin: 0, marginBottom: '16px' }}><BookOpen size={18} color="var(--color-secondary)" /> Academic Program</h3>
                  <div className="profile-meta-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
                    <div className="profile-meta-item">
                      <span className="profile-meta-label">Enrolled Course</span>
                      <span className="profile-meta-val" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>{child.courseEnrolled}</span>
                    </div>
                    <div className="profile-meta-item">
                      <span className="profile-meta-label">Assigned Batch</span>
                      <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{batch ? `${batch.name} (${batch.timing})` : 'Unassigned'}</span>
                    </div>
                    {teacher && (
                      <div className="profile-meta-item">
                        <span className="profile-meta-label">Class Instructor</span>
                        <span className="profile-meta-val" style={{ fontSize: '0.85rem' }}>{teacher.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="profile-meta-label" style={{ margin: 0 }}>Fee Invoices:</span>
                  <span className={`badge ${feeStatus === 'Paid' ? 'badge-success' : feeStatus === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                    {feeStatus}
                  </span>
                </div>
              </div>

              {/* Attendance Circle Indicator */}
              <div className="crm-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  {renderAttendanceRing()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>Attendance Record</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '4px 0' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Total Sessions: <strong style={{ color: 'var(--color-primary)' }}>{totalDays}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Present: <strong style={{ color: 'var(--color-success)' }}>{presentDays}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Absent: <strong style={{ color: 'var(--color-danger)' }}>{totalDays - presentDays}</strong>
                    </div>
                  </div>
                  <span className={`badge ${attendanceRate >= 80 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem', padding: '2px 8px', width: 'fit-content' }}>
                    {attendanceRate >= 80 ? 'Good Standing' : 'Needs Action'}
                  </span>
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
              {/* Scores Table - Desktop Only */}
              <div className="desktop-only-table table-wrapper">
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

              {/* Scores Accordion - Mobile Only */}
              <div className="mobile-only-list accordion-list" style={{ marginTop: '12px' }}>
                {childGrades.length > 0 ? (
                  childGrades.map((g, idx) => {
                    const isExpanded = expandedGradeId === g.id;
                    return (
                      <div 
                        key={g.id || idx} 
                        className="accordion-item"
                        onClick={() => setExpandedGradeId(isExpanded ? null : g.id)}
                      >
                        <div className="accordion-header">
                          <div>
                            <div className="accordion-title">{g.examName}</div>
                            <div className="accordion-subtitle">{g.subject}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>
                              {Math.round((g.score / g.maxScore) * 100)}%
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="accordion-details">
                            <div className="accordion-detail-row">
                              <span className="accordion-detail-label">Date Published</span>
                              <span className="accordion-detail-value">{g.date}</span>
                            </div>
                            <div className="accordion-detail-row">
                              <span className="accordion-detail-label">Secured Mark</span>
                              <span className="accordion-detail-value">{g.score} / {g.maxScore}</span>
                            </div>
                            {g.feedback && (
                              <div style={{ marginTop: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                                <span className="accordion-detail-label" style={{ display: 'block', marginBottom: '4px' }}>Instructor Remarks:</span>
                                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>"{g.feedback}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">No grades registered yet.</div>
                )}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <h3 className="crm-card-title" style={{ margin: 0 }}><Clock size={18} color="var(--color-info)" /> Historical Attendance Logs</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="form-label" style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>Filter:</span>
                <select 
                  value={attendanceFilter} 
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="select-dropdown"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: '120px', margin: 0 }}
                >
                  <option value="all">All Records</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>

            {/* Desktop Only Table View */}
            <div className="table-wrapper desktop-only-table" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Class Session</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, idx) => (
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
                        No daily attendance logs matched the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Only List View */}
            <div className="mobile-only-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className="accordion-item" 
                    style={{ 
                      padding: '12px 16px', 
                      background: 'var(--bg-card-hover)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--border-radius-sm)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{log.date}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{child.courseEnrolled}</span>
                    </div>
                    <div>
                      {log.status === 'Present' ? (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 8px', width: 'fit-content' }}>
                          <CheckCircle size={12} /> Present
                        </span>
                      ) : (
                        <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 8px', width: 'fit-content' }}>
                          <XCircle size={12} /> Absent
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No attendance records matched the selected filter.
                </div>
              )}
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
