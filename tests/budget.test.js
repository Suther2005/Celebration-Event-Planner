import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudgetTotals, calculateCategoryBreakdown } from '../src/utils/calculator.js';

test('calculateBudgetTotals handles empty / null event safely', () => {
  const result = calculateBudgetTotals(null);
  assert.equal(result.totalBudget, 0);
  assert.equal(result.totalSpent, 0);
  assert.equal(result.remainingBudget, 0);
  assert.equal(result.isOverBudget, false);
});

test('calculateBudgetTotals computes accurate spend and remaining balance', () => {
  const sampleEvent = {
    budget: 10000,
    guestCount: 50,
    expenses: [
      { id: '1', spent: 3000, allocated: 3500 },
      { id: '2', spent: 2500, allocated: 2500 },
      { id: '3', spent: 500, allocated: 1000 },
    ]
  };

  const totals = calculateBudgetTotals(sampleEvent);
  assert.equal(totals.totalBudget, 10000);
  assert.equal(totals.totalSpent, 6000);
  assert.equal(totals.totalAllocated, 7000);
  assert.equal(totals.remainingBudget, 4000);
  assert.equal(totals.isOverBudget, false);
  assert.equal(totals.spentPct, 60);
  assert.equal(totals.costPerGuest, 120); // 6000 / 50
});

test('calculateBudgetTotals triggers isOverBudget flag when expenses exceed ceiling', () => {
  const overEvent = {
    budget: 5000,
    expenses: [
      { id: '1', spent: 4000 },
      { id: '2', spent: 2000 },
    ]
  };

  const totals = calculateBudgetTotals(overEvent);
  assert.equal(totals.totalSpent, 6000);
  assert.equal(totals.remainingBudget, -1000);
  assert.equal(totals.isOverBudget, true);
});

test('calculateCategoryBreakdown groups expenses by category accurately', () => {
  const categories = [
    { id: 'venue', label: 'Venue & Rentals' },
    { id: 'catering', label: 'Catering & Beverages' },
  ];
  const expenses = [
    { id: '1', category: 'venue', spent: 2000, allocated: 2500 },
    { id: '2', category: 'venue', spent: 1000, allocated: 1000 },
    { id: '3', category: 'catering', spent: 1500, allocated: 2000 },
  ];

  const breakdown = calculateCategoryBreakdown(categories, expenses, 10000);
  assert.equal(breakdown.length, 2);

  const venue = breakdown.find(c => c.id === 'venue');
  assert.equal(venue.spent, 3000);
  assert.equal(venue.allocated, 3500);
  assert.equal(venue.pctOfBudget, 30);
  assert.equal(venue.itemCount, 2);

  const catering = breakdown.find(c => c.id === 'catering');
  assert.equal(catering.spent, 1500);
  assert.equal(catering.pctOfBudget, 15);
  assert.equal(catering.itemCount, 1);
});
