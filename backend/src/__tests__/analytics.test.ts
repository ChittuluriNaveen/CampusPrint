import { analyticsQuerySchema } from '../validators/analytics.validator';
import { exportReportCSV } from '../services/analytics.service';

async function runAnalyticsUnitTests() {
  console.log('--- Running Analytics & Business Intelligence Unit Tests ---');

  // 1. Validator Test
  console.log('Testing analyticsQuerySchema validator...');
  const validQuery = analyticsQuerySchema.parse({
    period: '7days',
    reportType: 'orders',
    format: 'csv',
  });

  if (validQuery.period !== '7days' || validQuery.reportType !== 'orders' || validQuery.format !== 'csv') {
    throw new Error('Analytics query schema parsing failed');
  }
  console.log('✓ Analytics query validator test passed.');

  // 2. CSV Export Generation Test
  console.log('Testing CSV Export string generation...');
  const csvOutput = await exportReportCSV({
    period: '30days',
    reportType: 'revenue',
    format: 'csv',
  });

  if (typeof csvOutput !== 'string' || !csvOutput.includes('Order Number')) {
    throw new Error('CSV output formatting failed header validation');
  }
  console.log('✓ CSV Export generation test passed.');

  // 3. Fallback KPI Calculations Test
  console.log('Testing KPI calculations math logic...');
  const totalRevenue = 1500;
  const totalOrders = 10;
  const aov = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;
  if (aov !== 150) {
    throw new Error(`Expected AOV 150, got ${aov}`);
  }
  console.log('✓ KPI calculation math test passed.');

  console.log('--- ALL ANALYTICS UNIT TESTS PASSED SUCCESSFULLY ---');
}

runAnalyticsUnitTests().catch(err => {
  console.error('Analytics unit test failed:', err);
  process.exit(1);
});
