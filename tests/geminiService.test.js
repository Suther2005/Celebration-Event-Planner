import test from 'node:test';
import assert from 'node:assert/strict';
import { geminiService, categorizeGeminiError, GEMINI_MODEL } from '../src/services/geminiService.js';

test('GEMINI_MODEL is verified as gemini-3.5-flash', () => {
  assert.equal(GEMINI_MODEL, 'gemini-3.5-flash');
});

test('categorizeGeminiError maps HTTP 503 as TEMPORARY_HIGH_DEMAND', () => {
  const err = new Error('Service Unavailable');
  err.status = 503;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'TEMPORARY_HIGH_DEMAND');
  assert.equal(res.status, 503);
  assert.match(res.guidance, /15–30 seconds/);
});

test('categorizeGeminiError maps high-demand text to TEMPORARY_HIGH_DEMAND', () => {
  const err = new Error('This model is currently experiencing high demand. Spikes in demand are usually temporary.');
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'TEMPORARY_HIGH_DEMAND');
});

test('categorizeGeminiError maps HTTP 429 as QUOTA_EXCEEDED', () => {
  const err = new Error('Resource exhausted: quota exceeded');
  err.status = 429;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'QUOTA_EXCEEDED');
  assert.equal(res.status, 429);
  assert.match(res.guidance, /Google AI Studio/);
});

test('categorizeGeminiError maps HTTP 401 / 403 as INVALID_KEY', () => {
  const err = new Error('API key not valid');
  err.status = 401;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'INVALID_KEY');
  assert.equal(res.status, 401);
});

test('categorizeGeminiError maps HTTP 404 as MODEL_NOT_FOUND', () => {
  const err = new Error('Model not found');
  err.status = 404;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'MODEL_NOT_FOUND');
  assert.equal(res.status, 404);
});

test('categorizeGeminiError maps TimeoutError as TIMEOUT', () => {
  const err = new Error('Request timed out after 45 seconds');
  err.name = 'TimeoutError';
  err.isTimeout = true;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'TIMEOUT');
  assert.equal(res.status, 408);
});

test('categorizeGeminiError maps network failures as NETWORK_ERROR', () => {
  const err = new Error('Failed to fetch');
  err.isNetwork = true;
  const res = categorizeGeminiError(err);
  assert.equal(res.type, 'NETWORK_ERROR');
});

test('generateFallbackThemes returns 3 rich structured themes for any event type', () => {
  const types = ['wedding', 'birthday', 'anniversary', 'community', 'gala', 'baby_shower'];

  for (const type of types) {
    const event = { title: `Test ${type}`, type, budget: 15000, guestCount: 100 };
    const themes = geminiService.generateFallbackThemes(event);

    assert.equal(Array.isArray(themes), true);
    assert.equal(themes.length, 3, `Expected 3 themes for event type ${type}`);

    for (const theme of themes) {
      assert.ok(theme.id, 'Theme should have id');
      assert.ok(theme.name, 'Theme should have name');
      assert.ok(theme.tagline, 'Theme should have tagline');
      assert.ok(Array.isArray(theme.palette), 'Theme should have palette array');
      assert.equal(theme.palette.length, 4, 'Palette should have 4 swatches');
      assert.ok(Array.isArray(theme.decorHighlights), 'Theme should have decorHighlights array');
      assert.ok(theme.recommendedMusic, 'Theme should have recommendedMusic');
      assert.ok(theme.cateringIdeas, 'Theme should have cateringIdeas');
      assert.ok(theme.budgetTip, 'Theme should have budgetTip');
    }
  }
});

test('generateFallbackThemes handles null event gracefully', () => {
  const themes = geminiService.generateFallbackThemes(null);
  assert.equal(Array.isArray(themes), true);
  assert.equal(themes.length, 3);
});

test('generateThemes falls back smoothly to local recommendation engine when no API key is provided', async () => {
  const result = await geminiService.generateThemes({
    event: { title: 'Golden Gala', type: 'gala', budget: 12000, guestCount: 150 }
  });
  assert.equal(result.success, true);
  assert.equal(result.source, 'local-ai-engine');
  assert.equal(result.themes.length, 3);
  assert.ok(result.summary);
});

