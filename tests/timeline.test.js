import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTimelineStats, getDueDateUrgency } from '../src/utils/calculator.js';

test('calculateTimelineStats returns zeros for empty task list', () => {
  const stats = calculateTimelineStats([]);
  assert.equal(stats.totalTasks, 0);
  assert.equal(stats.completedTasks, 0);
  assert.equal(stats.pendingTasks, 0);
  assert.equal(stats.progressPct, 0);
});

test('calculateTimelineStats computes correct progress percentage', () => {
  const tasks = [
    { id: '1', completed: true },
    { id: '2', completed: true },
    { id: '3', completed: false },
    { id: '4', completed: false },
  ];
  const stats = calculateTimelineStats(tasks);
  assert.equal(stats.totalTasks, 4);
  assert.equal(stats.completedTasks, 2);
  assert.equal(stats.pendingTasks, 2);
  assert.equal(stats.progressPct, 50);
});

test('getDueDateUrgency handles completed tasks or missing dates', () => {
  assert.equal(getDueDateUrgency(null, false), null);
  assert.equal(getDueDateUrgency('2026-12-01', true), null);
});

test('getDueDateUrgency flags overdue milestones', () => {
  const refDate = new Date('2026-10-25T12:00:00');
  const pastDate = '2026-10-20';
  const urgency = getDueDateUrgency(pastDate, false, refDate);
  assert.equal(urgency.status, 'overdue');
  assert.match(urgency.label, /Overdue/);
});

test('getDueDateUrgency flags upcoming milestones correctly', () => {
  const refDate = new Date('2026-10-25T12:00:00');
  const futureDate = '2026-10-27'; // 2 days away
  const urgency = getDueDateUrgency(futureDate, false, refDate);
  assert.equal(urgency.status, 'urgent');
  assert.equal(urgency.label, 'Due in 2d');
});
