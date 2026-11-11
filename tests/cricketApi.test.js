import test from 'node:test';
import assert from 'node:assert/strict';
import { oversToBalls, formatScore, runRate } from '../services/cricketApi.ts';
import liveHandler from '../api/cricbuzz/live.js';

test('oversToBalls converts cricket overs to total balls correctly', () => {
  assert.equal(oversToBalls(0), 0);
  assert.equal(oversToBalls(undefined), 0);
  assert.equal(oversToBalls(-1), 0);
  assert.equal(oversToBalls(0.1), 1);
  assert.equal(oversToBalls(0.5), 5);
  assert.equal(oversToBalls(1.0), 6);
  assert.equal(oversToBalls(15.5), 95);
  assert.equal(oversToBalls(19.6), 120);
  assert.equal(oversToBalls(20.0), 120);
});

test('formatScore handles various innings inputs safely', () => {
  assert.equal(formatScore(undefined), 'Yet to bat');
  assert.equal(formatScore({ inning: 'SRH Inning 1', runs: 0, wickets: 0, overs: 0 }), '0/0 (0)');
  assert.equal(formatScore({ inning: 'KKR Inning 1', runs: 165, wickets: 4, overs: 19.2 }), '165/4 (19.2)');
});

test('runRate calculates correct cricket economy rate', () => {
  assert.equal(runRate(undefined), '0.00');
  assert.equal(runRate({ inning: 'SRH', runs: 0, wickets: 0, overs: 0 }), '0.00');
  assert.equal(runRate({ inning: 'SRH', runs: 60, wickets: 1, overs: 10 }), '6.00');
  assert.equal(runRate({ inning: 'SRH', runs: 120, wickets: 2, overs: 15 }), '8.00');
  assert.equal(runRate({ inning: 'SRH', runs: 165, wickets: 4, overs: 19.4 }), '8.39');
});

test('api/cricbuzz/live handler returns live matches with valid schema', async () => {
  let statusCode = 200;
  let responseData = null;

  const mockRes = {
    statusCode: 200,
    setHeader: () => {},
    status: function (code) {
      statusCode = code;
      return this;
    },
    json: function (data) {
      responseData = data;
      return this;
    },
  };

  await liveHandler({ method: 'GET' }, mockRes);

  assert.equal(statusCode, 200);
  assert.ok(responseData);
  assert.ok(Array.isArray(responseData.matches));
  assert.ok(responseData.matches.length >= 2);

  const kkrMatch = responseData.matches[0];
  assert.equal(kkrMatch.matchInfo.team1.teamSName, 'SRH');
  assert.equal(kkrMatch.matchInfo.team2.teamSName, 'KKR');

  const kkrScore = kkrMatch.matchScore.team2Score.inngs1;
  assert.ok(kkrScore.runs >= 143 && kkrScore.runs <= 168);
  assert.ok(kkrScore.overs >= 15.5 && kkrScore.overs <= 20.0);
  assert.ok(kkrScore.wickets >= 2 && kkrScore.wickets <= 8);
});

test('api/cricbuzz/live handler rejects unsupported methods', async () => {
  let statusCode = 200;
  let responseData = null;

  const mockRes = {
    statusCode: 200,
    setHeader: () => {},
    status: function (code) {
      statusCode = code;
      return this;
    },
    json: function (data) {
      responseData = data;
      return this;
    },
  };

  await liveHandler({ method: 'POST' }, mockRes);

  assert.equal(statusCode, 405);
  assert.deepEqual(responseData, { error: 'Method not allowed' });
});
