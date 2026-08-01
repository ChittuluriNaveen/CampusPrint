import React from 'react';

interface PickupQRCodeProps {
  code: string;
  size?: number;
}

/**
 * Deterministic pseudo-QR SVG generator for Pickup Verification Codes.
 * Produces a high-contrast 17x17 grid QR visual barcode without external dependencies.
 */
export const PickupQRCode: React.FC<PickupQRCodeProps> = ({ code, size = 120 }) => {
  const gridSize = 17;
  const cells: boolean[][] = Array(gridSize)
    .fill(false)
    .map(() => Array(gridSize).fill(false));

  // Helper to draw standard QR finder pattern (7x7) at (row, col)
  const drawFinderPattern = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          cells[r + i][c + j] = true;
        }
      }
    }
  };

  // Top-left finder pattern
  drawFinderPattern(0, 0);
  // Top-right finder pattern
  drawFinderPattern(0, gridSize - 7);
  // Bottom-left finder pattern
  drawFinderPattern(gridSize - 7, 0);

  // Fill data matrix deterministically using code character charCodes
  let charIdx = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder patterns
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= gridSize - 7;
      const isBottomLeft = r >= gridSize - 7 && c < 7;
      if (isTopLeft || isTopRight || isBottomLeft) continue;

      const charVal = code.charCodeAt(charIdx % code.length);
      const hashBit = ((charVal * (r + 1) * 31 + c * 17 + r * 13) % 7) > 2;
      cells[r][c] = hashBit;
      charIdx++;
    }
  }

  const cellSize = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="bg-white p-2 rounded-xl shadow-inner border border-slate-200"
    >
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
              fill="#0f172a"
              rx={0.5}
            />
          ) : null
        )
      )}
    </svg>
  );
};
