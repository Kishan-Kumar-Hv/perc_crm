import React, { useState, useContext, useEffect } from 'react';
import { CRMContext } from './context/CRMContext';
const AdminPortal = React.lazy(() => import('./components/AdminPortal'));
const TeacherPortal = React.lazy(() => import('./components/TeacherPortal'));
const ParentPortal = React.lazy(() => import('./components/ParentPortal'));
import PERCLogo from './components/PERCLogo';
import { 
  GraduationCap, 
  Shield, 
  User, 
  Users, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Activity, 
  Calendar,
  Lock,
  X,
  Menu
} from 'lucide-react';

function App() {
  const { teachers, students } = useContext(CRMContext);
  const [currentPortal, setCurrentPortal] = useState(null); // null, 'admin', 'teacher', 'parent'
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Cloudinary image carousel configuration for Offline Coaching Centre
  const carouselImages = [
    "https://res.cloudinary.com/xq45vwun/image/upload/w_800,h_550,c_fit,f_auto,q_auto/WhatsApp_Image_2026-07-06_at_4.00.26_PM_z9rauh",
    "https://res.cloudinary.com/xq45vwun/image/upload/w_800,h_550,c_fit,f_auto,q_auto/WhatsApp_Image_2026-07-06_at_4.00.26_PM_1_n38lu0",
    "https://res.cloudinary.com/xq45vwun/image/upload/w_800,h_550,c_fit,f_auto,q_auto/WhatsApp_Image_2026-07-06_at_4.00.25_PM_frk5kc",
    "https://res.cloudinary.com/xq45vwun/image/upload/w_800,h_550,c_fit,f_auto,q_auto/WhatsApp_Image_2026-07-06_at_4.00.23_PM_ukvvdo",
    "https://res.cloudinary.com/xq45vwun/image/upload/w_800,h_550,c_fit,f_auto,q_auto/WhatsApp_Image_2026-07-06_at_4.00.23_PM_1_q1hnjj"
  ];
  
  const carouselCaptions = [
    "JEE Advanced Top Rankers & Academic Achievements",
    "NEET Medical Aspirants High Score Benchmarks",
    "Our Distinctions & State CET Board Toppers",
    "Celebrating Student Success and Dedication",
    "Personalized Mentorship Leading to Extraordinary Results"
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  // Hero quick selector state
  const [heroActiveRole, setHeroActiveRole] = useState('admin'); // 'admin', 'teacher', 'parent'
  const [heroTeacherId, setHeroTeacherId] = useState('');
  const [heroStudentId, setHeroStudentId] = useState('');

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState('admin');
  const [loginTeacherId, setLoginTeacherId] = useState('');
  const [loginStudentId, setLoginStudentId] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Inputs and Errors
  const [adminEmail, setAdminEmail] = useState('admin@perc.edu');
  const [adminPassword, setAdminPassword] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Auto-validate login selection state against active teacher database
  useEffect(() => {
    if (teachers.length > 0) {
      const exists = teachers.some(t => t.id === loginTeacherId);
      if (!exists) {
        setLoginTeacherId(teachers[0].id);
      }
    } else {
      setLoginTeacherId('');
    }
  }, [teachers, loginTeacherId]);

  // Auto-validate login selection state against active student database
  useEffect(() => {
    if (students.length > 0) {
      const exists = students.some(s => s.id === loginStudentId);
      if (!exists) {
        setLoginStudentId(students[0].id);
      }
    } else {
      setLoginStudentId('');
    }
  }, [students, loginStudentId]);

  const handlePortalClick = (role) => {
    setLoginRole(role);
    setLoginError('');
    setAdminPassword('');
    setTeacherPassword('');
    setParentPin('');
    setShowLoginModal(true);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setLoginError('');
    setAdminPassword('');
    setTeacherPassword('');
    setParentPin('');
  };

  const handleModalLogin = () => {
    setLoginError('');
    if (loginRole === 'admin') {
      if (adminEmail.trim() === 'admin@perc.edu' && adminPassword === 'PERC_Admin@2026!Secure') {
        setCurrentPortal('admin');
        closeModal();
      } else {
        setLoginError('Invalid Administrator credentials.');
      }
    } else if (loginRole === 'teacher') {
      const selectedTeacher = teachers.find(t => t.id === loginTeacherId);
      const expectedPassword = selectedTeacher && selectedTeacher.password 
        ? selectedTeacher.password.trim() 
        : (selectedTeacher ? selectedTeacher.contact.trim() : '');
      if (selectedTeacher && teacherPassword.trim() === expectedPassword) {
        enterTeacherPortal(loginTeacherId);
        closeModal();
      } else {
        setLoginError('Invalid Faculty credentials.');
      }
    } else if (loginRole === 'parent') {
      const selectedStudent = students.find(s => s.id === loginStudentId);
      const expectedPin = selectedStudent && selectedStudent.password 
        ? selectedStudent.password.trim() 
        : (selectedStudent ? selectedStudent.parentContact.trim() : '');
      if (selectedStudent && parentPin.trim() === expectedPin) {
        enterParentPortal(loginStudentId);
        closeModal();
      } else {
        setLoginError('Invalid Verification PIN.');
      }
    }
  };

  // Synchronize portal selection state with context updates
  useEffect(() => {
    if (teachers.length > 0) {
      const exists = teachers.some(t => t.id === selectedTeacherId);
      if (!exists) {
        setSelectedTeacherId(teachers[0].id);
        setHeroTeacherId(teachers[0].id);
      }
    } else {
      setSelectedTeacherId('');
      setHeroTeacherId('');
    }
  }, [teachers, selectedTeacherId]);

  useEffect(() => {
    if (students.length > 0) {
      const exists = students.some(s => s.id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(students[0].id);
        setHeroStudentId(students[0].id);
      }
    } else {
      setSelectedStudentId('');
      setHeroStudentId('');
    }
  }, [students, selectedStudentId]);

  // Scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle entry into teacher portal
  const enterTeacherPortal = (tId) => {
    const finalId = tId || selectedTeacherId || teachers[0]?.id || '';
    setSelectedTeacherId(finalId);
    setCurrentPortal('teacher');
  };

  // Handle entry into parent portal
  const enterParentPortal = (sId) => {
    const finalId = sId || selectedStudentId || students[0]?.id || '';
    setSelectedStudentId(finalId);
    setCurrentPortal('parent');
  };

  const handleSignOut = () => {
    setCurrentPortal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle the Quick Login action from Hero section
  const handleHeroQuickLogin = () => {
    if (heroActiveRole === 'admin') {
      setCurrentPortal('admin');
    } else if (heroActiveRole === 'teacher') {
      enterTeacherPortal(heroTeacherId);
    } else if (heroActiveRole === 'parent') {
      enterParentPortal(heroStudentId);
    }
  };

  if (currentPortal === null) {
    return (
      <div className="landing-page-container">
        {/* 1. Header (Navbar) */}
        <header className="landing-navbar">
          <PERCLogo variant="horizontal" height={45} />
          
          <nav className="landing-nav" style={{ display: 'flex', gap: '20px' }}>
            <a href="#hero-section" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('hero-section'); }}>Home</a>
            <a href="#portals-section" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('portals-section'); }}>Portals</a>
            <a href="#programs-section" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('programs-section'); }}>Programs</a>
            <a href="#about-section" className="landing-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about-section'); }}>About</a>
          </nav>

          <button className="btn btn-accent-red landing-desktop-portal-btn" onClick={() => scrollToSection('portals-section')}>
            Portal Access <Lock size={14} style={{ marginLeft: '6px' }} />
          </button>

          <button 
            className="landing-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#hero-section" className="landing-mobile-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); scrollToSection('hero-section'); }}>Home</a>
            <a href="#portals-section" className="landing-mobile-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); scrollToSection('portals-section'); }}>Portals Gateway</a>
            <a href="#programs-section" className="landing-mobile-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); scrollToSection('programs-section'); }}>Academic Programs</a>
            <a href="#about-section" className="landing-mobile-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); scrollToSection('about-section'); }}>About Us</a>
            <button className="btn btn-accent-red" style={{ width: '100%', marginTop: '12px' }} onClick={() => { setMobileMenuOpen(false); scrollToSection('portals-section'); }}>
              Portal Access <Lock size={14} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        )}

        {/* 2. Hero Section */}
        <section id="hero-section" className="landing-hero-section">
          <div className="landing-hero-grid">
            {/* Left Column: Hero Content */}
            <div className="landing-hero-content">
              <span className="hero-tagline">
                <Sparkles size={14} /> Premium Offline Coaching Center
              </span>
              
              <h1 className="landing-hero-title">
                Best Personalized Coaching <br/>
                for <span className="accent-red">IIT, NEET & CET</span> Prep
              </h1>
              
              <p className="landing-hero-desc">
                Personalized Education Research Center (PERC) integrates academic tracking, comprehensive tests, and individual feedback to build the ideal learning foundation.
              </p>

              {/* Call to Actions */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button className="btn btn-accent-red" onClick={() => scrollToSection('portals-section')}>
                  Access Portals <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
                <button className="btn btn-secondary" onClick={() => scrollToSection('programs-section')}>
                  Explore Programs
                </button>
              </div>
            </div>

            {/* Right Column: Premium Transition Visual Carousel */}
            <div className="landing-hero-visual">
              <div className="visual-mesh"></div>
              <div className="visual-mockup" style={{ padding: '16px', width: '100%' }}>
                <div className="mockup-header" style={{ marginBottom: '12px' }}>
                  <div className="mockup-dots">
                    <span className="mockup-dot"></span>
                    <span className="mockup-dot"></span>
                    <span className="mockup-dot"></span>
                  </div>
                  <span className="mockup-title">PERC Campus Highlights</span>
                </div>
                
                <div className="hero-slider-container">
                  {carouselImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`hero-slider-slide ${idx === activeImageIndex ? 'active' : ''}`}
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  ))}
                  
                  <div className="hero-slider-overlay"></div>
                  
                  <div className="hero-slider-caption">
                    <span className="badge-offline">Offline Campus</span>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      {carouselCaptions[activeImageIndex]}
                    </p>
                  </div>
                </div>

                <div className="hero-slider-dots">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`hero-slider-dot ${idx === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Statistics Section */}
        <section className="landing-stats-section">
          <div className="landing-stats-grid">
            <div className="stat-item">
              <div className="stat-num-box">1:1</div>
              <div className="stat-text-box">
                <h4>Personalized Focus</h4>
                <p>Ongoing rigorous support</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-num-box">IIT</div>
              <div className="stat-text-box">
                <h4>Expert Faculty</h4>
                <p>IIT/NEET subject experts</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-num-box">24/7</div>
              <div className="stat-text-box">
                <h4>Doubt Resolution</h4>
                <p>Immediate learning help</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-num-box">High</div>
              <div className="stat-text-box">
                <h4>Success Ratio</h4>
                <p>IIT/NEET entry success</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Portal Workspaces Selection (Original Gateway Redefined) */}
        <section id="portals-section" className="landing-content-section" style={{ background: '#FFFFFF' }}>
          <div className="landing-section-header">
            <span className="section-tag">Logins</span>
            <h2>Access Your Workspace Portal</h2>
            <p>Unified Portal Gateway for administrative staff, educators, students, and parents to coordinate schedules, attendance, and analytics.</p>
          </div>

          <div className="gateway-grid">
            {/* Admin Portal Card */}
            <div className="gateway-card" onClick={() => handlePortalClick('admin')} style={{ cursor: 'pointer', position: 'relative' }}>
              <div className="gateway-icon-bg" style={{ color: 'var(--color-accent-red)', background: 'rgba(138, 21, 37, 0.05)' }}>
                <Shield size={28} />
              </div>
              <h3>Administrative Workspace</h3>
              <p>Manage faculty recruitment, oversee academic batch schedules, configure students, review lead conversions, and monitor system-wide reports.</p>
              <button className="btn btn-primary gate-enter-btn" onClick={(e) => { e.stopPropagation(); handlePortalClick('admin'); }}>
                Access Admin Portal <ArrowRight size={16} />
              </button>
            </div>

            {/* Teacher Portal Card */}
            <div className="gateway-card" onClick={() => handlePortalClick('teacher')} style={{ cursor: 'pointer', position: 'relative' }}>
              <div className="gateway-icon-bg" style={{ color: 'var(--color-secondary)', background: 'rgba(74, 93, 120, 0.05)' }}>
                <User size={28} />
              </div>
              <h3>Teacher Desk</h3>
              <p>Mark daily class attendance, assign homework tasks, enter test marks, submit reviews, and track course curricula updates.</p>
              <button className="btn btn-primary gate-enter-btn" onClick={(e) => { e.stopPropagation(); handlePortalClick('teacher'); }}>
                Access Teacher Desk <ArrowRight size={16} />
              </button>
            </div>

            {/* Parent Portal Card */}
            <div className="gateway-card" onClick={() => handlePortalClick('parent')} style={{ cursor: 'pointer', position: 'relative' }}>
              <div className="gateway-icon-bg" style={{ color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <Users size={28} />
              </div>
              <h3>Parent & Student Hub</h3>
              <p>Check student test results, review attendance logs, read teacher remarks, check fee status, and view central announcements.</p>
              <button className="btn btn-primary gate-enter-btn" onClick={(e) => { e.stopPropagation(); handlePortalClick('parent'); }}>
                Access Student & Parent Hub <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Academic Tracks / Categories Section */}
        <section id="programs-section" className="landing-content-section" style={{ background: '#F6F5F1', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="landing-section-header">
            <span className="section-tag">Programs</span>
            <h2>Our Specialized Preparation Tracks</h2>
            <p>We provide personalized education strategies targeting major engineering, medical entrance examinations, and board tuitions.</p>
          </div>

          <div className="program-card-grid">
            <div className="program-card">
              <div className="program-icon-wrap">
                <Target size={28} />
              </div>
              <h3>IIT-JEE prep</h3>
              <p>Advanced physics, chemistry, and mathematics modules. Focused on JEE Main & Advanced mock testing, patterns, and analytics.</p>
            </div>

            <div className="program-card">
              <div className="program-icon-wrap">
                <Award size={28} />
              </div>
              <h3>NEET medical</h3>
              <p>Rigorous biology, physics, and chemistry practice. Specialized botany & zoology workshops with speed testing.</p>
            </div>

            <div className="program-card">
              <div className="program-icon-wrap">
                <BookOpen size={28} />
              </div>
              <h3>State CET</h3>
              <p>Syllabus-focused tutoring tailored to state board engineering and science common entrance examinations and test formats.</p>
            </div>

            <div className="program-card">
              <div className="program-icon-wrap">
                <GraduationCap size={28} />
              </div>
              <h3>School Tuition</h3>
              <p>Strong base concept clarity for junior college and high school classes. Builds fundamental critical thinking skills.</p>
            </div>
          </div>
        </section>

        {/* 6. Why Choose PERC Section (Features) */}
        <section id="about-section" className="landing-content-section" style={{ background: '#FFFFFF' }}>
          <div className="features-grid">
            <div>
              <span className="section-tag" style={{ color: 'var(--color-accent-red)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>About PERC</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
                Personalized Education for Guaranteed Growth
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                At the Personalized Education Research Center (PERC), we do not believe in one-size-fits-all training. Our research-driven teaching models map individual student strengths, targeting gaps dynamically.
              </p>

              <div className="features-bullets">
                <div className="feature-bullet-item">
                  <CheckCircle2 size={18} className="feature-bullet-icon" />
                  <div className="feature-bullet-text">
                    <h4>Expert Mentors</h4>
                    <p>Instructors from top universities.</p>
                  </div>
                </div>

                <div className="feature-bullet-item">
                  <CheckCircle2 size={18} className="feature-bullet-icon" />
                  <div className="feature-bullet-text">
                    <h4>Detailed Analytics</h4>
                    <p>Real-time mock scores and reviews.</p>
                  </div>
                </div>

                <div className="feature-bullet-item">
                  <CheckCircle2 size={18} className="feature-bullet-icon" />
                  <div className="feature-bullet-text">
                    <h4>Progress Alerts</h4>
                    <p>Immediate remarks logged for parents.</p>
                  </div>
                </div>

                <div className="feature-bullet-item">
                  <CheckCircle2 size={18} className="feature-bullet-icon" />
                  <div className="feature-bullet-text">
                    <h4>Tailored Timelines</h4>
                    <p>Custom revisions for slow areas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                className="float-anim"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '40px',
                  color: '#FFFFFF',
                  boxShadow: '0 20px 40px rgba(30,34,63,0.15)',
                  maxWidth: '450px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.1 }}>
                  <GraduationCap size={200} />
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '16px' }}>IIT-JEE / NEET Success</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  "Our daughter showed significant confidence spikes in physics numericals within 3 months of personalized research tracking at PERC."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    S
                  </div>
                  <div>
                    <h5 style={{ color: '#FFFFFF', fontSize: '0.9rem', margin: 0 }}>Dr. Sanjay Sen</h5>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', margin: 0 }}>Parent of Sneha (IIT Aspirant)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <PERCLogo variant="horizontal" height={45} className="footer-logo-override" />
              <p>
                PERC (Personalized Education Research Center) specializes in customized instruction pathways, mentoring secondary, senior school pupils, and preparing engineering/medical aspirants.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-link-group">
                <h4>Portals</h4>
                <ul>
                  <li><a href="#admin-portal" className="footer-link-item" onClick={(e) => { e.preventDefault(); handlePortalClick('admin'); }}>Admin Login</a></li>
                  <li><a href="#portals-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); handlePortalClick('teacher'); }}>Teacher Login</a></li>
                  <li><a href="#portals-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); handlePortalClick('parent'); }}>Parent Login</a></li>
                </ul>
              </div>

              <div className="footer-link-group">
                <h4>Programs</h4>
                <ul>
                  <li><a href="#programs-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('programs-section'); }}>IIT-JEE prep</a></li>
                  <li><a href="#programs-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('programs-section'); }}>NEET Medical</a></li>
                  <li><a href="#programs-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('programs-section'); }}>CET Entrance</a></li>
                  <li><a href="#programs-section" className="footer-link-item" onClick={(e) => { e.preventDefault(); scrollToSection('programs-section'); }}>School Tuition</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} PERC (Personalized Education Research Center). All rights reserved.</span>
            <span style={{ display: 'flex', gap: '16px' }}>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </span>
          </div>
        </footer>

        {/* Secure Unified Login Modal (Hides database info on public screen) */}
        {showLoginModal && (
          <div className="login-modal-backdrop" onClick={closeModal}>
            <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="login-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <PERCLogo variant="vertical" height={60} style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.25rem', margin: '8px 0 4px 0' }}>
                  Secure Workspace Sign In
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  Enter your credentials to access your personalized educational panel.
                </p>
              </div>

              {/* Role Selection Tabs inside Modal */}
              <div className="login-role-group">
                <button 
                  className={`login-role-btn ${loginRole === 'admin' ? 'active' : ''}`}
                  onClick={() => { setLoginRole('admin'); setLoginError(''); }}
                >
                  <Shield size={12} /> Admin
                </button>
                <button 
                  className={`login-role-btn ${loginRole === 'teacher' ? 'active' : ''}`}
                  onClick={() => { setLoginRole('teacher'); setLoginError(''); }}
                >
                  <User size={12} /> Teacher
                </button>
                <button 
                  className={`login-role-btn ${loginRole === 'parent' ? 'active' : ''}`}
                  onClick={() => { setLoginRole('parent'); setLoginError(''); }}
                >
                  <Users size={12} /> Student / Parent
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loginRole === 'admin' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Administrator ID</label>
                      <input 
                        type="text" 
                        className="text-input" 
                        value={adminEmail} 
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@perc.edu" 
                        style={{ background: '#fff', color: '#333' }} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Security Code</label>
                      <input 
                        type="password" 
                        className="text-input" 
                        value={adminPassword} 
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password" 
                        style={{ background: '#fff', color: '#333' }} 
                      />
                    </div>
                  </>
                )}

                {loginRole === 'teacher' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Select Faculty Member</label>
                      <select 
                        className="select-dropdown" 
                        value={loginTeacherId} 
                        onChange={(e) => setLoginTeacherId(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                      >
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.subjects[0]})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Password</label>
                      <input 
                        type="password" 
                        className="text-input" 
                        value={teacherPassword} 
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="Enter your password" 
                        style={{ background: '#fff', color: '#333' }} 
                      />
                    </div>
                  </>
                )}

                {loginRole === 'parent' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Select Student Profile</label>
                      <select 
                        className="select-dropdown" 
                        value={loginStudentId} 
                        onChange={(e) => setLoginStudentId(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Password</label>
                      <input 
                        type="password" 
                        className="text-input" 
                        value={parentPin} 
                        onChange={(e) => setParentPin(e.target.value)}
                        placeholder="Enter your password" 
                        style={{ background: '#fff', color: '#333' }} 
                      />
                    </div>
                  </>
                )}

                {loginError && (
                  <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', padding: '4px', background: '#fef2f2', borderRadius: '4px', border: '1px solid #fee2e2' }}>
                    ⚠️ {loginError}
                  </div>
                )}

                <button className="btn btn-accent-red" style={{ width: '100%', marginTop: '8px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleModalLogin}>
                  Verify & Enter Workspace <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', background: '#F6F5F1', fontFamily: 'var(--font-family)', color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
        <div className="glow-anim" style={{ fontSize: '2rem' }}>🎓</div>
        <div>Loading Secure Portal...</div>
      </div>
    }>
      {currentPortal === 'admin' && (
        <AdminPortal onSignOut={handleSignOut} />
      )}
      {currentPortal === 'teacher' && (
        <TeacherPortal 
          teacherId={selectedTeacherId} 
          onChangeTeacher={setSelectedTeacherId}
          onSignOut={handleSignOut} 
        />
      )}
      {currentPortal === 'parent' && (
        <ParentPortal 
          studentId={selectedStudentId} 
          onChangeStudent={setSelectedStudentId}
          onSignOut={handleSignOut} 
        />
      )}
    </React.Suspense>
  );
}

export default App;
