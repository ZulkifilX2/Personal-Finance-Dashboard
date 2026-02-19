import { test, mock } from 'node:test';
import assert from 'node:assert';
import axios from 'axios';
import { getStats } from './api.ts';

test('getStats should fetch and return stats data', async () => {
  const mockStats = { totalTransactions: 10, totalAmount: 500 };

  // Mock axios.get
  const getMock = mock.method(axios, 'get', async (url: string) => {
    if (url.endsWith('/stats')) {
      return { data: mockStats };
    }
    throw new Error(`Unexpected URL: ${url}`);
  });

  try {
    const result = await getStats();
    assert.deepStrictEqual(result, mockStats);
    assert.strictEqual(getMock.mock.callCount(), 1);
  } finally {
    getMock.mock.restore();
  }
});

test('getStats should throw error when API fails', async () => {
  // Mock axios.get to throw an error
  const getMock = mock.method(axios, 'get', async () => {
    throw new Error('API Error');
  });

  try {
    await assert.rejects(async () => {
      await getStats();
    }, {
      message: 'API Error'
    });
    assert.strictEqual(getMock.mock.callCount(), 1);
  } finally {
    getMock.mock.restore();
  }
});
