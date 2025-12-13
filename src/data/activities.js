import { addDays, subDays } from 'date-fns';

const now = new Date();

export const activities = [
  {
    id: 'a1',
    title: 'Live: Introduction to Generative AI',
    type: 'online_class',
    status: 'in_progress',
    startAt: subDays(now, 1).toISOString(),
    dueDate: addDays(now, 2).toISOString(),
    durationMinutes: 60,
    instructor: 'Dr. Vega',
    program: 'AI Foundations',
    progress: 45,
    tags: ['recording available', 'slides uploaded'],
  },
  {
    id: 'a2',
    title: 'Assignment: Build a Sentiment Classifier',
    type: 'assignment',
    status: 'not_started',
    startAt: now.toISOString(),
    dueDate: addDays(now, 4).toISOString(),
    durationMinutes: 120,
    instructor: 'Prof. Ortiz',
    program: 'Machine Learning',
    progress: 0,
    tags: ['pair-work allowed'],
  },
  {
    id: 'a3',
    title: 'Quiz: Fundamentals of Cloud Security',
    type: 'quiz',
    status: 'not_started',
    startAt: subDays(now, 2).toISOString(),
    dueDate: addDays(now, 1).toISOString(),
    durationMinutes: 30,
    instructor: 'Dr. Yang',
    program: 'Cloud Computing',
    progress: 0,
    tags: ['timed', 'auto-graded'],
  },
  {
    id: 'a4',
    title: 'Discussion: Prompt Engineering Strategies',
    type: 'discussion',
    status: 'submitted',
    startAt: subDays(now, 3).toISOString(),
    dueDate: subDays(now, 1).toISOString(),
    durationMinutes: 45,
    instructor: 'Coach Rivera',
    program: 'AI Foundations',
    progress: 100,
    tags: ['peer review pending'],
  },
  {
    id: 'a5',
    title: 'Workshop: Deploying Models with Docker',
    type: 'online_class',
    status: 'graded',
    startAt: subDays(now, 5).toISOString(),
    dueDate: subDays(now, 4).toISOString(),
    durationMinutes: 90,
    instructor: 'Dr. Chen',
    program: 'ML Ops',
    progress: 100,
    tags: ['certificate available'],
  },
  {
    id: 'a6',
    title: 'Assignment: Design a Data Pipeline',
    type: 'assignment',
    status: 'in_progress',
    startAt: subDays(now, 1).toISOString(),
    dueDate: addDays(now, 6).toISOString(),
    durationMinutes: 180,
    instructor: 'Prof. Lee',
    program: 'Data Engineering',
    progress: 35,
    tags: ['requires dataset download'],
  },
  {
    id: 'a7',
    title: 'Quiz: Kubernetes Fundamentals',
    type: 'quiz',
    status: 'graded',
    startAt: subDays(now, 7).toISOString(),
    dueDate: subDays(now, 6).toISOString(),
    durationMinutes: 25,
    instructor: 'Dr. Yang',
    program: 'Cloud Computing',
    progress: 100,
    tags: ['review answers'],
  },
  {
    id: 'a8',
    title: 'Discussion: Responsible AI Case Study',
    type: 'discussion',
    status: 'not_started',
    startAt: now.toISOString(),
    dueDate: addDays(now, 8).toISOString(),
    durationMinutes: 40,
    instructor: 'Coach Rivera',
    program: 'AI Foundations',
    progress: 0,
    tags: ['rubric provided'],
  },
];

export const fetchActivities = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(activities);
    }, 350);
  });

export default activities;
