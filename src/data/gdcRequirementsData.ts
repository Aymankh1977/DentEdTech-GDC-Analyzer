import { GDCRequirement } from '../types/gdcRequirements';

export const COMPREHENSIVE_GDC_REQUIREMENTS: GDCRequirement[] = [
  // PATIENT SAFETY DOMAIN
  {
    id: '1.1',
    domain: 'Patient Safety',
    code: 'S1.1',
    title: 'Clinical Governance Framework',
    description: 'Robust clinical governance systems ensuring patient safety and quality of care',
    criteria: [
      'Clinical incident reporting and learning systems',
      'Risk management protocols and registers',
      'Clinical audit programmes with action planning',
      'Quality improvement mechanisms',
      'Patient feedback and complaint systems'
    ],
    weight: 15,
    category: 'critical',
    inspectionFocus: ['Incident reporting systems', 'Audit cycles', 'Risk management']
  },
  {
    id: '1.2',
    domain: 'Patient Safety',
    code: 'S1.2',
    title: 'Student Clinical Competence',
    description: 'Students provide care only when competent under appropriate supervision',
    criteria: [
      'Competency assessment framework with clear benchmarks',
      'Supervision levels defined for different procedures',
      'Progressive clinical responsibility',
      'Competency verification processes',
      'Remediation systems for underperforming students'
    ],
    weight: 15,
    category: 'critical',
    inspectionFocus: ['Competency assessments', 'Supervision records', 'Remediation processes']
  },
  {
    id: '1.3',
    domain: 'Patient Safety',
    code: 'S1.3',
    title: 'Infection Prevention and Control',
    description: 'Comprehensive IPC protocols aligned with national standards',
    criteria: [
      'IPC policy aligned with latest guidelines',
      'Regular IPC training for staff and students',
      'Equipment decontamination protocols',
      'Environmental cleaning schedules',
      'Outbreak management procedures'
    ],
    weight: 12,
    category: 'critical',
    inspectionFocus: ['IPC policies', 'Training records', 'Decontamination processes']
  },

  // CURRICULUM DOMAIN
  {
    id: '2.1',
    domain: 'Curriculum',
    code: 'S2.1',
    title: 'Learning Outcomes Alignment',
    description: 'Curriculum enables students to meet all Preparing for Practice learning outcomes',
    criteria: [
      'Comprehensive curriculum mapping against GDC outcomes',
      'Integrated spiral curriculum design',
      'Regular curriculum review and enhancement',
      'Stakeholder input in curriculum development',
      'Alignment with contemporary dental practice'
    ],
    weight: 10,
    category: 'important',
    inspectionFocus: ['Curriculum mapping', 'Review cycles', 'Stakeholder engagement']
  },
  {
    id: '2.2',
    domain: 'Curriculum',
    code: 'S2.2',
    title: 'Clinical Experience Structure',
    description: 'Structured clinical experience with adequate patient exposure',
    criteria: [
      'Clinical progression framework with milestones',
      'Adequate patient exposure with case variety',
      'Supervised clinical practice with gradual autonomy',
      'Clinical portfolio with reflective practice',
      'Patient consent and communication training'
    ],
    weight: 12,
    category: 'important',
    inspectionFocus: ['Patient logs', 'Supervision arrangements', 'Clinical progression']
  },

  // ASSESSMENT DOMAIN
  {
    id: '3.1',
    domain: 'Assessment',
    code: 'S3.1',
    title: 'Assessment Strategy',
    description: 'Comprehensive assessment methods aligned with learning outcomes',
    criteria: [
      'Assessment blueprint mapping to outcomes',
      'Multiple assessment methods with validity evidence',
      'Standard setting with appropriate methods',
      'Robust moderation and quality assurance',
      'Formative assessment with feedback cycles'
    ],
    weight: 10,
    category: 'important',
    inspectionFocus: ['Assessment blueprint', 'Moderation records', 'Feedback systems']
  },
  {
    id: '3.2',
    domain: 'Assessment',
    code: 'S3.2',
    title: 'Progression and Completion',
    description: 'Clear progression criteria and robust examination governance',
    criteria: [
      'Clear progression criteria in regulations',
      'Robust examination board governance',
      'External examiner input and oversight',
      'Appeals procedures with independent elements',
      'Data-informed progression decisions'
    ],
    weight: 8,
    category: 'important',
    inspectionFocus: ['Examination regulations', 'External examiner reports', 'Progression data']
  },

  // STAFFING DOMAIN
  {
    id: '4.1',
    domain: 'Staffing',
    code: 'S4.1',
    title: 'Staff Qualifications and Development',
    description: 'Adequately qualified staff with ongoing professional development',
    criteria: [
      'Staff qualification and experience profiles',
      'Appropriate staff-student ratios',
      'Systematic staff development programmes',
      'Clinical competence maintenance',
      'Performance management and appraisal'
    ],
    weight: 8,
    category: 'important',
    inspectionFocus: ['Staff profiles', 'Development records', 'Performance management']
  },

  // RESOURCES DOMAIN
  {
    id: '5.1',
    domain: 'Resources',
    code: 'S5.1',
    title: 'Educational Facilities and Equipment',
    description: 'Adequate facilities, equipment and learning resources',
    criteria: [
      'Adequate clinical facilities with modern equipment',
      'Comprehensive simulation and skills laboratory',
      'Well-resourced library with specialist collections',
      'Robust IT infrastructure supporting learning',
      'Appropriate learning spaces for all activities'
    ],
    weight: 7,
    category: 'standard',
    inspectionFocus: ['Facilities audit', 'Equipment inventory', 'Learning resources']
  },

  // QUALITY ASSURANCE DOMAIN
  {
    id: '6.1',
    domain: 'Quality Assurance',
    code: 'S6.1',
    title: 'Quality Assurance Framework',
    description: 'Comprehensive quality assurance with continuous improvement',
    criteria: [
      'Comprehensive quality assurance framework',
      'Systematic annual monitoring and review',
      'Effective student feedback and engagement',
      'Robust external scrutiny systems',
      'Continuous improvement culture and processes'
    ],
    weight: 8,
    category: 'important',
    inspectionFocus: ['Quality framework', 'Annual monitoring', 'Improvement actions']
  },
  {
    id: '6.2',
    domain: 'Quality Assurance',
    code: 'S6.2',
    title: 'Stakeholder Engagement',
    description: 'Effective engagement with patients, students and stakeholders',
    criteria: [
      'Patient involvement mechanisms',
      'Student representation systems',
      'Employer engagement processes',
      'Alumni networks and feedback',
      'Community partnerships'
    ],
    weight: 5,
    category: 'standard',
    inspectionFocus: ['Stakeholder feedback', 'Engagement records', 'Partnership working']
  }
];
