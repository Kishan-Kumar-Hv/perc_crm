import React, { createContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export const CRMContext = createContext();

const defaultStudents = [
  {
    id: 'REG-2026-0001',
    name: 'Joel',
    parentName: 'Sundari S',
    parentContact: '8668394644',
    parentEmail: 'sundariasha925@gmail.com',
    className: 'CBSE - 10',
    courseEnrolled: 'CBSE Class 10 Board Prep',
    batchId: 'B-001',
    admissionDate: '2025-09-01',
    feeStatus: 'Paid'
  }
];
const defaultTeachers = [
  {
    id: 'T-2026-0001',
    name: 'Dr. Alok Verma',
    email: 'alok.verma@school.com',
    contact: '9876543210',
    subjects: ['Mathematics'],
    assignedBatches: ['B-001']
  }
];
const defaultBatches = [
  {
    id: 'B-001',
    name: 'CBSE - 10',
    courseName: 'CBSE Class 10 Board Prep',
    timing: '03:00 PM - 08:00 PM',
    teacherId: 'T-2026-0001'
  }
];

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
  'B-001_2026-07-01': { 'REG-2026-0001': 'Present' }
};
const defaultGrades = [
  {
    id: 'GR-3001',
    studentId: 'REG-2026-0001',
    batchId: 'B-001',
    subject: 'Advanced Mathematics',
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
    studentId: 'REG-2026-0001',
    teacherName: 'Dr. Alok Verma',
    feedback: 'Aarav is highly proactive in class discussions.',
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

export const CRMProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [students, setStudents] = useState(() => {
    const val = localStorage.getItem('crm_v3_students');
    return val ? JSON.parse(val) : defaultStudents;
  });

  const [teachers, setTeachers] = useState(() => {
    const val = localStorage.getItem('crm_v3_teachers');
    return val ? JSON.parse(val) : defaultTeachers;
  });

  const [batches, setBatches] = useState(() => {
    const val = localStorage.getItem('crm_v3_batches');
    return val ? JSON.parse(val) : defaultBatches;
  });



  const [announcements, setAnnouncements] = useState(() => {
    const val = localStorage.getItem('crm_v3_announcements');
    return val ? JSON.parse(val) : defaultAnnouncements;
  });

  const [attendance, setAttendance] = useState(() => {
    const val = localStorage.getItem('crm_v3_attendance');
    return val ? JSON.parse(val) : defaultAttendance;
  });

  const [grades, setGrades] = useState(() => {
    const val = localStorage.getItem('crm_v3_grades');
    return val ? JSON.parse(val) : defaultGrades;
  });

  const [observations, setObservations] = useState(() => {
    const val = localStorage.getItem('crm_v3_observations');
    return val ? JSON.parse(val) : defaultObservations;
  });

  const [resources, setResources] = useState(() => {
    const val = localStorage.getItem('crm_v3_resources');
    return val ? JSON.parse(val) : defaultResources;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('crm_v3_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('crm_v3_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('crm_v3_batches', JSON.stringify(batches));
  }, [batches]);



  useEffect(() => {
    localStorage.setItem('crm_v3_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('crm_v3_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('crm_v3_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('crm_v3_observations', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('crm_v3_resources', JSON.stringify(resources));
  }, [resources]);

  // Initial Load from MongoDB Atlas Express API
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const res = await fetch('/api/crm-data');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            // Overwrite defaults even if arrays are empty, since we are syncing with database
            setStudents(data.students || []);
            setTeachers(data.teachers || []);
            setBatches(data.batches || []);

            setAnnouncements(data.announcements || []);
            setAttendance(data.attendance || {});
            setGrades(data.grades || []);
            setObservations(data.observations || []);
            setResources(data.resources || []);
            console.log('CRM Data successfully loaded from MongoDB Atlas!');
          }
        }
      } catch (err) {
        console.warn('MongoDB Atlas backend offline. Continuing with LocalStorage.');
      } finally {
        setIsLoaded(true);
      }
    };
    fetchMongoData();
  }, []);

  // Debounced Sync to MongoDB Atlas Express API
  useEffect(() => {
    const syncToMongo = async () => {
      try {
        await fetch('/api/crm-data/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            students, teachers, batches, announcements, attendance, grades, observations, resources
          })
        });
      } catch (err) {
        console.warn('MongoDB Atlas sync deferred: Express server offline.');
      }
    };

    if (isLoaded) {
      const timer = setTimeout(syncToMongo, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, students, teachers, batches, announcements, attendance, grades, observations, resources]);

  // Operations
  const addStudent = (st) => {
    const nextIdNum = students.length > 0 
      ? Math.max(...students.map(s => parseInt(s.id.split('-')[2]))) + 1 
      : 1;
    const formattedId = `REG-2026-${String(nextIdNum).padStart(4, '0')}`;
    const newStudent = { ...st, id: formattedId, admissionDate: new Date().toISOString().split('T')[0] };
    setStudents(prev => [...prev, newStudent]);
    showToast('Student registered successfully!', 'success');
    return newStudent;
  };

  const updateStudent = (updated) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast('Student details updated successfully.', 'info');
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Student removed from database.', 'error');
  };

  const addTeacher = (tc) => {
    const nextIdNum = teachers.length > 0
      ? Math.max(...teachers.map(t => parseInt(t.id.split('-')[2]))) + 1
      : 1;
    const formattedId = `T-2026-${String(nextIdNum).padStart(4, '0')}`;
    const newTeacher = { ...tc, id: formattedId, assignedBatches: tc.assignedBatches || [] };
    setTeachers(prev => [...prev, newTeacher]);
    showToast('Faculty member added successfully!', 'success');
    return newTeacher;
  };

  const updateTeacher = (updated) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
    showToast('Faculty details updated successfully.', 'info');
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Faculty member deleted.', 'error');
  };

  const addBatch = (bt) => {
    const nextIdNum = batches.length > 0
      ? Math.max(...batches.map(b => parseInt(b.id.split('-')[1]))) + 1
      : 1;
    const formattedId = `B-${String(nextIdNum).padStart(3, '0')}`;
    const newBatch = { ...bt, id: formattedId };
    setBatches(prev => [...prev, newBatch]);
    showToast('Academic batch created successfully.', 'success');
    return newBatch;
  };

  const updateBatch = (updated) => {
    setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
    showToast('Batch timings/details updated.', 'info');
  };

  const deleteBatch = (id) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    // Reset batchId on students assigned to this batch
    setStudents(prev => prev.map(s => s.batchId === id ? { ...s, batchId: '' } : s));
    showToast('Academic batch deleted.', 'error');
  };



  const addAnnouncement = (an) => {
    const nextIdNum = announcements.length > 0
      ? Math.max(...announcements.map(a => parseInt(a.id.split('-')[1]))) + 1
      : 2001;
    const formattedId = `AN-${nextIdNum}`;
    const newAn = { ...an, id: formattedId, date: new Date().toISOString().split('T')[0] };
    setAnnouncements(prev => [newAn, ...prev]);
    showToast('New circular/announcement published!', 'success');
    return newAn;
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Circular/announcement removed.', 'error');
  };

  const saveAttendance = (batchId, date, data) => {
    const key = `${batchId}_${date}`;
    setAttendance(prev => ({
      ...prev,
      [key]: data
    }));
  };

  const saveGrade = (gd) => {
    const nextIdNum = grades.length > 0
      ? Math.max(...grades.map(g => parseInt(g.id.split('-')[1]))) + 1
      : 3001;
    const formattedId = `GR-${nextIdNum}`;
    const newGrade = { ...gd, id: formattedId, date: gd.date || new Date().toISOString().split('T')[0] };
    setGrades(prev => [newGrade, ...prev]);
    return newGrade;
  };

  const addObservation = (studentId, teacherName, feedback) => {
    const nextIdNum = observations.length > 0
      ? Math.max(...observations.map(o => parseInt(o.id.split('-')[1]))) + 1
      : 4001;
    const formattedId = `OB-${nextIdNum}`;
    const newObs = {
      id: formattedId,
      studentId,
      teacherName,
      feedback,
      date: new Date().toISOString().split('T')[0]
    };
    setObservations(prev => [newObs, ...prev]);
    return newObs;
  };

  const addResource = (rs) => {
    const nextIdNum = resources.length > 0
      ? Math.max(...resources.map(r => parseInt(r.id.split('-')[1]))) + 1
      : 5001;
    const formattedId = `RS-${nextIdNum}`;
    const newRs = {
      ...rs,
      id: formattedId,
      date: new Date().toISOString().split('T')[0],
      link: rs.link || '#resource'
    };
    setResources(prev => [newRs, ...prev]);
    return newRs;
  };

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <CRMContext.Provider value={{
      students,
      teachers,
      batches,

      announcements,
      attendance,
      grades,
      observations,
      resources,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addBatch,
      updateBatch,
      deleteBatch,

      addAnnouncement,
      deleteAnnouncement,
      saveAttendance,
      saveGrade,
      addObservation,
      addResource,
      showToast
    }}>
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' && <CheckCircle2 size={16} />}
              {toast.type === 'error' && <XCircle size={16} />}
              {toast.type === 'warning' && <AlertCircle size={16} />}
              {toast.type === 'info' && <Info size={16} />}
            </span>
            <span className="toast-msg">{toast.message}</span>
          </div>
        </div>
      )}
      {children}
    </CRMContext.Provider>
  );
};
