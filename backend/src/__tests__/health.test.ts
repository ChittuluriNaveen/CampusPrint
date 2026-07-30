import { getLiveness, getReadiness, getMetrics } from '../controllers/health.controller';

export const runHealthCheckTests = async () => {
  console.log('--- Running Infrastructure Health & Readiness Unit Tests ---');

  // Test 1: Liveness Endpoint Response
  console.log('1. Testing Liveness Controller Endpoint...');
  let livenessStatus = 0;
  let livenessPayload: any = null;

  const mockResLiveness: any = {
    status: (code: number) => {
      livenessStatus = code;
      return {
        json: (data: any) => {
          livenessPayload = data;
        },
      };
    },
  };

  getLiveness({} as any, mockResLiveness);
  if (livenessStatus !== 200 || livenessPayload?.status !== 'ok') {
    throw new Error('Health Unit Test Failed: Liveness endpoint response invalid.');
  }
  console.log('✓ Liveness endpoint test passed.');

  // Test 2: Readiness Endpoint Response
  console.log('2. Testing Readiness Controller Endpoint...');
  let readinessStatus = 0;
  let readinessPayload: any = null;

  const mockResReadiness: any = {
    status: (code: number) => {
      readinessStatus = code;
      return {
        json: (data: any) => {
          readinessPayload = data;
        },
      };
    },
  };

  await getReadiness({} as any, mockResReadiness);
  if (![200, 503].includes(readinessStatus) || !readinessPayload?.checks) {
    throw new Error('Health Unit Test Failed: Readiness endpoint response invalid.');
  }
  console.log('✓ Readiness endpoint test passed.');

  // Test 3: System Metrics Controller
  console.log('3. Testing Metrics Controller Endpoint...');
  let metricsStatus = 0;
  let metricsPayload: any = null;

  const mockResMetrics: any = {
    status: (code: number) => {
      metricsStatus = code;
      return {
        json: (data: any) => {
          metricsPayload = data;
        },
      };
    },
  };

  await getMetrics({} as any, mockResMetrics);
  if (metricsStatus !== 200 || !metricsPayload?.memory || !metricsPayload?.uptimeSeconds) {
    throw new Error('Health Unit Test Failed: Metrics endpoint response invalid.');
  }
  console.log('✓ Metrics endpoint test passed.');

  console.log('--- ALL HEALTH & READINESS UNIT TESTS PASSED SUCCESSFULLY ---\n');
};

if (require.main === module) {
  runHealthCheckTests().catch(err => {
    console.error('Health check unit test failed:', err);
    process.exit(1);
  });
}
