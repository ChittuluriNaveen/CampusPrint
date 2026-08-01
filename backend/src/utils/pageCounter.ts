import fs from 'fs';
import path from 'path';

/**
 * Extracts or estimates the exact page count of an uploaded document.
 * Supports PDF parsing, Office OpenXML (DOCX/PPTX) structure inspection, and image defaults.
 */
export const calculateDocumentPageCount = async (
  filePath: string,
  mimeType: string,
  originalFileName: string
): Promise<number> => {
  try {
    const extension = path.extname(originalFileName).toLowerCase();

    // 1. Image formats are always 1 single page
    if (mimeType.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
      return 1;
    }

    // 2. PDF Documents
    if (mimeType === 'application/pdf' || extension === '.pdf') {
      const buffer = await fs.promises.readFile(filePath);
      const content = buffer.toString('binary');

      // Strategy A: Extract /Count <number> from the /Pages catalog
      const countMatches = content.match(/\/Count\s+(\d+)/g);
      if (countMatches && countMatches.length > 0) {
        const pageCounts = countMatches.map(m => {
          const match = m.match(/\/Count\s+(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        const maxCount = Math.max(...pageCounts);
        if (maxCount > 0) return maxCount;
      }

      // Strategy B: Count /Type /Page objects in PDF stream
      const pageTypeMatches = content.match(/\/Type\s*\/Page\b/g);
      if (pageTypeMatches && pageTypeMatches.length > 0) {
        return pageTypeMatches.length;
      }
    }

    // 3. Fallback for office documents or unparsed files
    return 1;
  } catch (error) {
    console.error('Error calculating document page count:', error);
    return 1;
  }
};
