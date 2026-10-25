import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVendorStats } from '../src/utils/calculator.js';

test('calculateVendorStats returns zeros for empty vendor list', () => {
  const stats = calculateVendorStats([]);
  assert.equal(stats.totalVendors, 0);
  assert.equal(stats.bookedCount, 0);
  assert.equal(stats.totalCommittedCost, 0);
});

test('calculateVendorStats aggregates booked count and committed cost', () => {
  const vendors = [
    { id: '1', name: 'DJ Sound', status: 'booked', cost: 1200 },
    { id: '2', name: 'Gourmet Catering', status: 'deposit_paid', cost: 3500 },
    { id: '3', name: 'Floral Studio', status: 'contacted', cost: 800 },
    { id: '4', name: 'Venue Grand', status: 'researching', cost: 5000 },
  ];

  const stats = calculateVendorStats(vendors);
  assert.equal(stats.totalVendors, 4);
  assert.equal(stats.bookedCount, 2); // booked + deposit_paid
  assert.equal(stats.totalCommittedCost, 10500); // 1200 + 3500 + 800 + 5000
});
