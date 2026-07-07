import React, { useContext } from 'react';
import { CRMContext } from '../context/CRMContext';
import { ShieldAlert, UserCheck, Users } from 'lucide-react';
import PERCLogo from './PERCLogo';

export default function RoleSwitcher({ currentRole, onChangeRole }) {
  const { teachers, students } = useContext(CRMContext);

  const handleRoleClick = (role) => {
    if (role === 'admin') {
      onChangeRole({ role: 'admin', teacherId: '', studentId: '' });
    } else if (role === 'teacher') {
      const firstTeacher = teachers[0]?.id || '';
      onChangeRole({ role: 'teacher', teacherId: firstTeacher, studentId: '' });
    } else if (role === 'parent') {
      const firstStudent = students[0]?.id || '';
      onChangeRole({ role: 'parent', teacherId: '', studentId: firstStudent });
    }
  };

  const handleTeacherChange = (e) => {
    onChangeRole({ role: 'teacher', teacherId: e.target.value, studentId: '' });
  };

  const handleParentChange = (e) => {
    onChangeRole({ role: 'parent', teacherId: '', studentId: e.target.value });
  };

  return (
    <header className="role-switcher-container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PERCLogo variant="horizontal" height={36} />
      </div>

      <div className="role-switcher-actions">
        <div className="role-btn-group">
          <button 
            className={`role-btn ${currentRole.role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleClick('admin')}
          >
            <ShieldAlert size={16} />
            Admin
          </button>
          
          <button 
            className={`role-btn ${currentRole.role === 'teacher' ? 'active' : ''}`}
            onClick={() => handleRoleClick('teacher')}
          >
            <UserCheck size={16} />
            Teacher
          </button>
          
          <button 
            className={`role-btn ${currentRole.role === 'parent' ? 'active' : ''}`}
            onClick={() => handleRoleClick('parent')}
          >
            <Users size={16} />
            Parent
          </button>
        </div>

        {currentRole.role === 'teacher' && teachers.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="form-label" style={{ margin: 0 }}>Active Teacher:</span>
            <select 
              value={currentRole.teacherId} 
              onChange={handleTeacherChange}
              className="select-dropdown"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.subjects[0]})</option>
              ))}
            </select>
          </div>
        )}

        {currentRole.role === 'parent' && students.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="form-label" style={{ margin: 0 }}>Child View:</span>
            <select 
              value={currentRole.studentId} 
              onChange={handleParentChange}
              className="select-dropdown"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </header>
  );
}
