/**
 * MonitorTissue — Unit Tests
 * Tissue ID: TIS-MONITOR-v0.1.0
 * Test Hash: 956ddcdb
 */

import { MonitorTissue } from '../src/entity';
import { NIGERIA_FIRST_CONFIG, TISSUE_ID, COMPOSED_CELLS } from '../src/types';

describe('MonitorTissue', () => {
  let tissue: MonitorTissue;

  beforeEach(() => {
    tissue = new MonitorTissue();
  });

  describe('Identity', () => {
    it('should have correct tissue ID', () => {
      expect(TISSUE_ID).toBe('TIS-MONITOR-v0.1.0');
    });

    it('should compose correct cells', () => {
      expect(COMPOSED_CELLS).toEqual(['CEL-HEALTHCHECK', 'CEL-METRICS', 'CEL-ALERTING']);
    });
  });

  describe('Coordination', () => {
    it('should coordinate requests with Nigeria-first defaults', async () => {
      const request = {
        requestId: 'test-956ddcdb-001',
        sourceCell: 'CEL-HEALTHCHECK',
        targetCells: ['CEL-HEALTHCHECK', 'CEL-METRICS', 'CEL-ALERTING'],
        payload: { action: 'test' },
        timeout: NIGERIA_FIRST_CONFIG.DEFAULT_TIMEOUT_MS,
        locale: NIGERIA_FIRST_CONFIG.DEFAULT_LOCALE,
        offlineCapable: true,
      };
      const result = await tissue.coordinate(request);
      expect(result.requestId).toBe('test-956ddcdb-001');
      expect(['completed', 'partial', 'queued']).toContain(result.status);
    });

    it('should enforce 30s Nigeria-first timeout', () => {
      expect(NIGERIA_FIRST_CONFIG.DEFAULT_TIMEOUT_MS).toBe(30_000);
    });

    it('should use en-NG locale by default', () => {
      expect(NIGERIA_FIRST_CONFIG.DEFAULT_LOCALE).toBe('en-NG');
    });
  });

  describe('Offline First (NON-NEGOTIABLE)', () => {
    it('should queue requests when offline', async () => {
      const request = {
        requestId: 'offline-956ddcdb-001',
        sourceCell: 'CEL-HEALTHCHECK',
        targetCells: ['CEL-HEALTHCHECK'],
        payload: { action: 'offline-test' },
        timeout: 30000,
        locale: 'en-NG',
        offlineCapable: true,
      };
      const result = await tissue.coordinateOffline(request);
      expect(result.status).toBe('queued');
      expect(result.offlineQueued).toBe(true);
    });

    it('should report queue depth in health check', async () => {
      const health = await tissue.getHealth();
      expect(health.tissueId).toBe('TIS-MONITOR-v0.1.0');
      expect(typeof health.queueDepth).toBe('number');
    });
  });

  describe('Sync', () => {
    it('should sync offline queue', async () => {
      const context = {
        syncId: 'sync-956ddcdb-001',
        lastSyncTimestamp: Date.now() - 60000,
        vectorClock: new Map(),
        conflictStrategy: 'last-write-wins' as const,
      };
      const result = await tissue.sync(context);
      expect(result.syncId).toBe('sync-956ddcdb-001');
      expect(typeof result.itemsSynced).toBe('number');
    });
  });
});
