// Chart Generator for Gia AI Reports
// Generates data visualizations for work reports

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  category?: string;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'progress' | 'timeline';
  title: string;
  data: ChartDataPoint[] | TimeSeriesPoint[];
  colors?: string[];
  showLegend?: boolean;
  showValues?: boolean;
}

// Default color schemes
export const colorSchemes = {
  default: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'],
  blue: ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  purple: ['#6B21A8', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  gradient: ['#667EEA', '#764BA2', '#F093FB', '#4FACFE', '#00F2FE', '#43E97B'],
  professional: ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'],
};

// Extract metrics from work updates text
export function extractMetrics(workUpdates: string): {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  categories: { [key: string]: number };
} {
  const lines = workUpdates.toLowerCase().split('\n').filter(line => line.trim());
  
  let tasksCompleted = 0;
  let tasksInProgress = 0;
  let tasksPending = 0;
  const categories: { [key: string]: number } = {
    development: 0,
    design: 0,
    testing: 0,
    documentation: 0,
    meeting: 0,
    other: 0,
  };

  // Keywords for status detection
  const completedKeywords = ['selesai', 'done', 'completed', 'finished', 'sukses', 'berhasil', 'fix', 'implemented'];
  const inProgressKeywords = ['sedang', 'progress', 'working', 'developing', 'coding', 'designing'];
  const pendingKeywords = ['pending', 'waiting', 'akan', 'planned', 'next', 'todo'];

  // Keywords for category detection
  const categoryKeywords = {
    development: ['develop', 'coding', 'code', 'api', 'backend', 'frontend', 'database', 'bug', 'fix', 'implement'],
    design: ['design', 'ui', 'ux', 'mockup', 'prototype', 'figma', 'layout', 'visual', 'graphic'],
    testing: ['test', 'testing', 'qa', 'quality', 'debug', 'review'],
    documentation: ['document', 'doc', 'documentation', 'readme', 'guide', 'manual'],
    meeting: ['meeting', 'rapat', 'diskusi', 'sync', 'standup', 'review'],
  };

  lines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;

    // Check status
    const hasCompleted = completedKeywords.some(keyword => line.includes(keyword));
    const hasInProgress = inProgressKeywords.some(keyword => line.includes(keyword));
    const hasPending = pendingKeywords.some(keyword => line.includes(keyword));

    if (hasCompleted) tasksCompleted++;
    else if (hasInProgress) tasksInProgress++;
    else if (hasPending) tasksPending++;
    else tasksCompleted++; // Default to completed

    // Check category
    let categorized = false;
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => line.includes(keyword))) {
        categories[category]++;
        categorized = true;
        break;
      }
    }
    if (!categorized) categories.other++;
  });

  return { tasksCompleted, tasksInProgress, tasksPending, categories };
}

// Generate progress chart data
export function generateProgressChart(metrics: {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
}): ChartConfig {
  return {
    type: 'doughnut',
    title: 'Progress Overview',
    data: [
      { label: 'Completed', value: metrics.tasksCompleted, color: '#10B981' },
      { label: 'In Progress', value: metrics.tasksInProgress, color: '#F59E0B' },
      { label: 'Pending', value: metrics.tasksPending, color: '#6B7280' },
    ],
    showLegend: true,
    showValues: true,
  };
}

// Generate category distribution chart
export function generateCategoryChart(categories: { [key: string]: number }): ChartConfig {
  const data = Object.entries(categories)
    .filter(([_, value]) => value > 0)
    .map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
    }));

  // If no categories detected, show default distribution
  if (data.length === 0) {
    return {
      type: 'bar',
      title: 'Work Distribution by Category',
      data: [
        { label: 'Tasks', value: 1 },
      ],
      colors: colorSchemes.gradient,
      showLegend: false,
      showValues: true,
    };
  }

  return {
    type: 'bar',
    title: 'Work Distribution by Category',
    data,
    colors: colorSchemes.gradient,
    showLegend: false,
    showValues: true,
  };
}

// Generate weekly timeline data (simulated)
export function generateTimelineChart(tasksCount: number): ChartConfig {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const data = days.map((day, index) => ({
    label: day,
    value: Math.floor((tasksCount / 5) * (0.8 + Math.random() * 0.4)),
  }));

  return {
    type: 'line',
    title: 'Tasks Completed This Week',
    data,
    colors: ['#3B82F6'],
    showLegend: false,
    showValues: false,
  };
}

// Generate all charts from work updates
export function generateAllCharts(workUpdates: string): {
  progress: ChartConfig;
  category: ChartConfig;
  timeline: ChartConfig;
  metrics: any;
} {
  const metrics = extractMetrics(workUpdates);
  const totalTasks = metrics.tasksCompleted + metrics.tasksInProgress + metrics.tasksPending;

  return {
    progress: generateProgressChart(metrics),
    category: generateCategoryChart(metrics.categories),
    timeline: generateTimelineChart(totalTasks),
    metrics,
  };
}

// Convert chart to SVG string (for PDF embedding)
export function chartToSVG(config: ChartConfig): string {
  const width = 400;  // Reduced from 600
  const height = 300; // Increased from 280 for better title space
  const padding = 50; // Reduced from 60

  if (config.type === 'bar') {
    return generateBarChartSVG(config, width, height, padding);
  } else if (config.type === 'doughnut' || config.type === 'pie') {
    return generateDoughnutChartSVG(config, width, height);
  } else if (config.type === 'line') {
    return generateLineChartSVG(config, width, height, padding);
  }

  return '';
}

function generateBarChartSVG(config: ChartConfig, width: number, height: number, padding: number): string {
  const data = config.data as ChartDataPoint[];
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - padding * 2) / data.length - 10;
  const chartHeight = height - padding * 2;

  const bars = data.map((point, i) => {
    const barHeight = (point.value / maxValue) * chartHeight;
    const x = padding + i * (barWidth + 10);
    const y = height - padding - barHeight;
    const color = config.colors?.[i] || colorSchemes.default[i % colorSchemes.default.length];

    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="3"/>
      ${config.showValues ? `<text x="${x + barWidth / 2}" y="${y - 3}" text-anchor="middle" font-size="10" fill="#374151">${point.value}</text>` : ''}
      <text x="${x + barWidth / 2}" y="${height - padding + 15}" text-anchor="middle" font-size="10" fill="#6B7280">${point.label}</text>
    `;
  }).join('');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="30" text-anchor="middle" font-size="14" font-weight="600" fill="#1F2937">${config.title}</text>
      ${bars}
    </svg>
  `;
}

function generateDoughnutChartSVG(config: ChartConfig, width: number, height: number): string {
  const data = config.data as ChartDataPoint[];
  const centerX = width / 2;
  const centerY = height / 2 - 10;
  const radius = Math.min(width, height) / 2 - 60;
  const innerRadius = radius * 0.6;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const paths = data.map((point, i) => {
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const color = point.color || config.colors?.[i] || colorSchemes.default[i % colorSchemes.default.length];

    const path = describeArc(centerX, centerY, radius, innerRadius, startAngle, endAngle);
    
    return `<path d="${path}" fill="${color}"/>`;
  }).join('');

  const legend = data.map((point, i) => {
    const color = point.color || config.colors?.[i] || colorSchemes.default[i % colorSchemes.default.length];
    const y = height - 50 + i * 16;
    const percentage = ((point.value / total) * 100).toFixed(1);
    
    return `
      <rect x="15" y="${y}" width="10" height="10" fill="${color}" rx="2"/>
      <text x="30" y="${y + 8}" font-size="10" fill="#374151">${point.label}: ${point.value} (${percentage}%)</text>
    `;
  }).join('');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="25" text-anchor="middle" font-size="14" font-weight="600" fill="#1F2937">${config.title}</text>
      ${paths}
      ${config.showLegend ? legend : ''}
    </svg>
  `;
}

function generateLineChartSVG(config: ChartConfig, width: number, height: number, padding: number): string {
  const data = config.data as ChartDataPoint[];
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const stepX = chartWidth / (data.length - 1);

  const points = data.map((point, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (point.value / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const dots = data.map((point, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (point.value / maxValue) * chartHeight;
    return `<circle cx="${x}" cy="${y}" r="3" fill="${config.colors?.[0] || '#3B82F6'}"/>`;
  }).join('');

  const labels = data.map((point, i) => {
    const x = padding + i * stepX;
    return `<text x="${x}" y="${height - padding + 15}" text-anchor="middle" font-size="10" fill="#6B7280">${point.label}</text>`;
  }).join('');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${width / 2}" y="25" text-anchor="middle" font-size="14" font-weight="600" fill="#1F2937">${config.title}</text>
      <polyline points="${points}" fill="none" stroke="${config.colors?.[0] || '#3B82F6'}" stroke-width="2"/>
      ${dots}
      ${labels}
    </svg>
  `;
}

function describeArc(x: number, y: number, radius: number, innerRadius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    'Z'
  ].join(' ');
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
