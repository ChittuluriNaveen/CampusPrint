import { calculateItemPricing, calculateOrderPricing } from '../services/pricing.service';
import { PaperSize, ColourMode, DuplexMode } from '@prisma/client';

export const runPerformanceBenchmarkTests = async () => {
  console.log('--- Running Performance & Latency Benchmark Unit Tests ---');

  // Test 1: Pricing Calculation Latency Benchmark
  console.log('1. Benchmarking Pricing Engine Execution Speed...');
  const iterations = 50;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    await calculateItemPricing({
      pages: 50,
      copies: 3,
      paperSize: PaperSize.A4,
      colourMode: ColourMode.BW,
      duplexMode: DuplexMode.DOUBLE,
      binding: true,
      lamination: false,
      coverPage: true,
    });
  }

  const durationMs = performance.now() - startTime;
  const avgLatencyPerCallUs = (durationMs / iterations) * 1000; // microseconds

  console.log(`- Executed ${iterations} pricing calculations in ${durationMs.toFixed(2)} ms.`);
  console.log(`- Average Latency: ${avgLatencyPerCallUs.toFixed(2)} µs / call.`);

  if (durationMs > 1000) {
    throw new Error(`Performance Benchmark Failed: Pricing engine took ${durationMs.toFixed(2)}ms (>1000ms target limit).`);
  }
  console.log('✓ Pricing Engine execution speed test passed.');

  // Test 2: Order Summary Total Calculation Benchmark
  console.log('2. Benchmarking Bulk Order Cost Breakdown Calculation...');
  const orderStartTime = performance.now();
  const fileItems = Array.from({ length: 10 }, (_, idx) => ({
    pages: (idx + 1) * 2,
    copies: (idx % 3) + 1,
    paperSize: PaperSize.A4,
    colourMode: idx % 2 === 0 ? ColourMode.BW : ColourMode.COLOUR,
    duplexMode: idx % 2 === 0 ? DuplexMode.SINGLE : DuplexMode.DOUBLE,
    binding: idx % 5 === 0,
    lamination: idx % 10 === 0,
    coverPage: false,
  }));

  const orderCalculations = 10;
  for (let i = 0; i < orderCalculations; i++) {
    await calculateOrderPricing({ items: fileItems });
  }

  const orderDurationMs = performance.now() - orderStartTime;
  console.log(`- Executed ${orderCalculations} bulk 10-file order total breakdowns in ${orderDurationMs.toFixed(2)} ms.`);

  if (orderDurationMs > 1000) {
    throw new Error(`Performance Benchmark Failed: Bulk order calculation took ${orderDurationMs.toFixed(2)}ms (>1000ms target limit).`);
  }
  console.log('✓ Bulk Order Breakdown calculation speed test passed.');

  console.log('--- ALL PERFORMANCE BENCHMARK TESTS PASSED SUCCESSFULLY ---\n');
};

if (require.main === module) {
  runPerformanceBenchmarkTests().catch(err => {
    console.error('Performance benchmark unit test failed:', err);
    process.exit(1);
  });
}
