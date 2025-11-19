import { GDCRequirement } from '../types/gdcRequirements';

export const COMPREHENSIVE_GDC_REQUIREMENTS: GDCRequirement[] = [
  {
    id: 'PS-1.1', domain: 'Patient Safety', code: 'S1.1', title: 'Clinical Governance Framework',
    description: 'Robust clinical governance systems ensuring patient safety and quality care',
    criteria: ['Clinical incident reporting', 'Risk management protocols', 'Clinical audit programmes'],
    weight: 15, category: 'critical'
  },
  {
    id: 'PS-1.2', domain: 'Patient Safety', code: 'S1.2', title: 'Student Clinical Competence',
    description: 'Students provide care only when competent under appropriate supervision',
    criteria: ['Competency assessment framework', 'Supervision levels defined', 'Progressive clinical responsibility'],
    weight: 15, category: 'critical'
  },
  {
    id: 'PS-1.3', domain: 'Patient Safety', code: 'S1.3', title: 'Infection Prevention and Control',
    description: 'Comprehensive IPC protocols aligned with national standards',
    criteria: ['IPC policy aligned with guidelines', 'Regular IPC training', 'Equipment decontamination protocols'],
    weight: 12, category: 'critical'
  },
  {
    id: 'PS-1.4', domain: 'Patient Safety', code: 'S1.4', title: 'Medical Emergencies Management',
    description: 'Robust systems for managing medical emergencies in clinical settings',
    criteria: ['Medical emergency protocols', 'Emergency equipment availability', 'Staff training in emergency response'],
    weight: 10, category: 'critical'
  },
  {
    id: 'PS-1.5', domain: 'Patient Safety', code: 'S1.5', title: 'Radiography Safety',
    description: 'Safe use of radiography in accordance with IRMER regulations',
    criteria: ['Radiography safety protocols', 'IRMER compliance systems', 'Radiation protection supervision'],
    weight: 8, category: 'important'
  },
  {
    id: 'PS-1.6', domain: 'Patient Safety', code: 'S1.6', title: 'Patient Consent Procedures',
    description: 'Robust consent processes ensuring informed patient decision-making',
    criteria: ['Informed consent procedures', 'Consent documentation systems', 'Capacity assessment protocols'],
    weight: 10, category: 'critical'
  },
  {
    id: 'PS-1.7', domain: 'Patient Safety', code: 'S1.7', title: 'Safeguarding Vulnerable Patients',
    description: 'Systems to safeguard children and vulnerable adults',
    criteria: ['Safeguarding policies and procedures', 'Staff training in safeguarding', 'DBS checks for relevant staff'],
    weight: 8, category: 'critical'
  },
  {
    id: 'PS-1.8', domain: 'Patient Safety', code: 'S1.8', title: 'Medicines Management',
    description: 'Safe management and administration of medicines',
    criteria: ['Medicines management protocols', 'Prescribing and administration procedures', 'Controlled drugs management'],
    weight: 8, category: 'important'
  },
  {
    id: 'CUR-2.1', domain: 'Curriculum', code: 'S2.1', title: 'Learning Outcomes Alignment',
    description: 'Curriculum enables students to meet all Preparing for Practice learning outcomes',
    criteria: ['Comprehensive curriculum mapping', 'Integrated spiral curriculum design', 'Regular curriculum review'],
    weight: 12, category: 'important'
  },
  {
    id: 'CUR-2.2', domain: 'Curriculum', code: 'S2.2', title: 'Clinical Experience Structure',
    description: 'Structured clinical experience with adequate patient exposure',
    criteria: ['Clinical progression framework', 'Adequate patient exposure', 'Supervised clinical practice'],
    weight: 12, category: 'important'
  },
  {
    id: 'CUR-2.3', domain: 'Curriculum', code: 'S2.3', title: 'Biomedical Sciences Integration',
    description: 'Integration of biomedical sciences throughout the curriculum',
    criteria: ['Basic sciences foundation', 'Clinical application of biomedical knowledge', 'Integrated teaching across disciplines'],
    weight: 8, category: 'important'
  },
  {
    id: 'CUR-2.4', domain: 'Curriculum', code: 'S2.4', title: 'Professionalism and Ethics',
    description: 'Development of professional values and ethical practice',
    criteria: ['Professionalism teaching throughout curriculum', 'Ethical decision-making frameworks', 'Fitness to practise procedures'],
    weight: 8, category: 'important'
  },
  {
    id: 'CUR-2.5', domain: 'Curriculum', code: 'S2.5', title: 'Communication Skills Development',
    description: 'Development of effective communication with patients and colleagues',
    criteria: ['Patient communication skills training', 'Interprofessional communication', 'Written communication skills'],
    weight: 7, category: 'standard'
  },
  {
    id: 'CUR-2.6', domain: 'Curriculum', code: 'S2.6', title: 'Digital Dentistry Integration',
    description: 'Integration of digital technologies in dental education',
    criteria: ['Digital dentistry curriculum components', 'CAD/CAM technology exposure', 'Digital records management'],
    weight: 6, category: 'standard'
  },
  {
    id: 'ASS-3.1', domain: 'Assessment', code: 'S3.1', title: 'Assessment Strategy',
    description: 'Comprehensive assessment methods aligned with learning outcomes',
    criteria: ['Assessment blueprint mapping', 'Multiple assessment methods', 'Standard setting with appropriate methods'],
    weight: 10, category: 'important'
  },
  {
    id: 'ASS-3.2', domain: 'Assessment', code: 'S3.2', title: 'Clinical Competence Assessment',
    description: 'Robust assessment of clinical skills and competence',
    criteria: ['Direct observation of clinical skills', 'OSCEs and practical assessments', 'Workplace-based assessments'],
    weight: 12, category: 'critical'
  },
  {
    id: 'ASS-3.3', domain: 'Assessment', code: 'S3.3', title: 'Progression and Completion',
    description: 'Clear progression criteria and robust examination governance',
    criteria: ['Clear progression criteria', 'Robust examination board governance', 'External examiner input'],
    weight: 10, category: 'important'
  },
  {
    id: 'ASS-3.4', domain: 'Assessment', code: 'S3.4', title: 'Feedback Mechanisms',
    description: 'Effective feedback systems supporting student development',
    criteria: ['Timely and constructive feedback', 'Formative feedback opportunities', 'Feedback literacy development'],
    weight: 8, category: 'important'
  },
  {
    id: 'ASS-3.5', domain: 'Assessment', code: 'S3.5', title: 'Examination Security',
    description: 'Robust systems ensuring examination integrity',
    criteria: ['Examination security protocols', 'Malpractice detection and procedures', 'Secure assessment materials'],
    weight: 7, category: 'important'
  },
  {
    id: 'STA-4.1', domain: 'Staffing', code: 'S4.1', title: 'Staff Qualifications and Experience',
    description: 'Adequately qualified staff with appropriate experience',
    criteria: ['Staff qualification verification', 'Relevant clinical experience', 'Teaching qualifications and training'],
    weight: 10, category: 'important'
  },
  {
    id: 'STA-4.2', domain: 'Staffing', code: 'S4.2', title: 'Staff Development',
    description: 'Systematic staff development and CPD programmes',
    criteria: ['Staff development programmes', 'Teaching excellence development', 'Clinical skills maintenance'],
    weight: 8, category: 'important'
  },
  {
    id: 'STA-4.3', domain: 'Staffing', code: 'S4.3', title: 'Staff-Student Ratios',
    description: 'Appropriate staff-student ratios for safe and effective teaching',
    criteria: ['Clinical supervision ratios', 'Small group teaching ratios', 'Research supervision capacity'],
    weight: 9, category: 'important'
  },
  {
    id: 'STA-4.4', domain: 'Staffing', code: 'S4.4', title: 'Staff Performance Management',
    description: 'Effective performance management and appraisal systems',
    criteria: ['Regular performance appraisals', 'Teaching quality monitoring', 'Clinical competence maintenance'],
    weight: 7, category: 'standard'
  },
  {
    id: 'RES-5.1', domain: 'Resources', code: 'S5.1', title: 'Clinical Facilities and Equipment',
    description: 'Adequate clinical facilities with modern equipment',
    criteria: ['Adequate clinical facilities', 'Modern dental equipment', 'Equipment maintenance programmes'],
    weight: 10, category: 'important'
  },
  {
    id: 'RES-5.2', domain: 'Resources', code: 'S5.2', title: 'Simulation and Skills Facilities',
    description: 'Comprehensive simulation and skills laboratory facilities',
    criteria: ['Simulation laboratory facilities', 'Phantom head facilities', 'Clinical skills training equipment'],
    weight: 8, category: 'important'
  },
  {
    id: 'RES-5.3', domain: 'Resources', code: 'S5.3', title: 'Library and Learning Resources',
    description: 'Well-resourced library with specialist collections',
    criteria: ['Dental specialist collections', 'Electronic resources access', 'Study spaces and facilities'],
    weight: 7, category: 'standard'
  },
  {
    id: 'RES-5.4', domain: 'Resources', code: 'S5.4', title: 'IT Infrastructure',
    description: 'Robust IT infrastructure supporting learning and administration',
    criteria: ['Learning management systems', 'Clinical records systems', 'Research computing facilities'],
    weight: 7, category: 'standard'
  },
  {
    id: 'QA-6.1', domain: 'Quality Assurance', code: 'S6.1', title: 'Quality Assurance Framework',
    description: 'Comprehensive quality assurance with continuous improvement',
    criteria: ['Comprehensive quality assurance framework', 'Systematic annual monitoring', 'Effective student feedback'],
    weight: 10, category: 'important'
  },
  {
    id: 'QA-6.2', domain: 'Quality Assurance', code: 'S6.2', title: 'Student Voice and Engagement',
    description: 'Effective student representation and feedback systems',
    criteria: ['Student representation systems', 'Course evaluation processes', 'Student feedback mechanisms'],
    weight: 8, category: 'important'
  },
  {
    id: 'QA-6.3', domain: 'Quality Assurance', code: 'S6.3', title: 'External Examiner System',
    description: 'Robust external examiner system with independent oversight',
    criteria: ['External examiner appointments', 'Comprehensive reporting systems', 'Action planning from feedback'],
    weight: 8, category: 'important'
  },
  {
    id: 'QA-6.4', domain: 'Quality Assurance', code: 'S6.4', title: 'Stakeholder Engagement',
    description: 'Effective engagement with patients, employers and stakeholders',
    criteria: ['Patient involvement mechanisms', 'Employer engagement processes', 'Alumni networks and feedback'],
    weight: 7, category: 'standard'
  },
  {
    id: 'QA-6.5', domain: 'Quality Assurance', code: 'S6.5', title: 'Data Management and Reporting',
    description: 'Effective data management supporting quality enhancement',
    criteria: ['Student performance data analysis', 'Graduate outcomes tracking', 'Quality metrics monitoring'],
    weight: 6, category: 'standard'
  }
];
