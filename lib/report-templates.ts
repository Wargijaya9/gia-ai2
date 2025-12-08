export const reportTemplates = {
  weekly: {
    name: 'Laporan Mingguan',
    icon: '📅',
    description: 'Template untuk laporan progress mingguan',
    defaultTitle: 'Laporan Progress Mingguan',
    sections: [
      'Ringkasan Eksekutif',
      'Pencapaian Minggu Ini',
      'Kendala & Solusi',
      'Rencana Minggu Depan',
    ],
  },
  monthly: {
    name: 'Laporan Bulanan',
    icon: '📆',
    description: 'Template untuk laporan bulanan komprehensif',
    defaultTitle: 'Laporan Bulanan',
    sections: [
      'Executive Summary',
      'Achievements & Milestones',
      'Metrics & Analytics',
      'Challenges & Learnings',
      'Next Month Planning',
    ],
  },
  project: {
    name: 'Laporan Project',
    icon: '🎯',
    description: 'Template untuk laporan project/sprint',
    defaultTitle: 'Laporan Project',
    sections: [
      'Project Overview',
      'Sprint Summary',
      'Deliverables',
      'Technical Implementation',
      'Timeline & Next Steps',
    ],
  },
  client: {
    name: 'Client Report',
    icon: '🤝',
    description: 'Template formal untuk client/stakeholder',
    defaultTitle: 'Client Progress Report',
    sections: [
      'Executive Summary',
      'Deliverables Status',
      'Business Value',
      'Risk Management',
      'Recommendations',
    ],
  },
  technical: {
    name: 'Technical Report',
    icon: '💻',
    description: 'Template detail untuk dokumentasi teknis',
    defaultTitle: 'Technical Documentation Report',
    sections: [
      'Technical Overview',
      'Architecture & Design',
      'Implementation Details',
      'Testing & Quality',
      'Performance Analysis',
      'Technical Debt',
    ],
  },
  design: {
    name: 'Design Report',
    icon: '🎨',
    description: 'Template untuk design deliverables',
    defaultTitle: 'Design Progress Report',
    sections: [
      'Design Concept',
      'Visual Deliverables',
      'Design System Updates',
      'User Feedback',
      'Next Iterations',
    ],
  },
};

export type TemplateType = keyof typeof reportTemplates;

export const getTemplateInstructions = (templateType: TemplateType): string => {
  const template = reportTemplates[templateType];
  
  return `
TEMPLATE: ${template.name}

Fokus pada sections berikut dengan detail yang sesuai template:

${template.sections.map((section, idx) => `${idx + 1}. **${section}**`).join('\n')}

${templateType === 'weekly' ? `
GUIDELINES WEEKLY REPORT:
- Ringkas tapi comprehensive
- Fokus pada deliverables minggu ini
- Highlight blockers dan how they were resolved
- Clear action items untuk minggu depan
- Tone: Update-style, straightforward
` : ''}

${templateType === 'monthly' ? `
GUIDELINES MONTHLY REPORT:
- Comprehensive overview satu bulan penuh
- Include metrics dan data-driven insights
- Strategic analysis dan long-term impact
- Quarterly alignment check
- Tone: Analytical, strategic
` : ''}

${templateType === 'project' ? `
GUIDELINES PROJECT REPORT:
- Project-specific achievements
- Sprint goals vs actual delivery
- Technical implementation details
- Dependencies dan blockers
- Tone: Detail-oriented, technical
` : ''}

${templateType === 'client' ? `
GUIDELINES CLIENT REPORT:
- Business-focused language (less technical jargon)
- Emphasis on value delivery
- Professional dan polished
- Risk mitigation transparency
- Clear ROI indicators
- Tone: Professional, business-focused
` : ''}

${templateType === 'technical' ? `
GUIDELINES TECHNICAL REPORT:
- Deep technical details
- Architecture diagrams description
- Code quality metrics
- Performance benchmarks
- Technical decision rationale
- Tone: Technical, detailed, expert-level
` : ''}

${templateType === 'design' ? `
GUIDELINES DESIGN REPORT:
- Visual-first approach
- Design thinking process
- User-centric insights
- Iteration reasoning
- Style guide updates
- Tone: Creative, user-focused
` : ''}
`;
};
