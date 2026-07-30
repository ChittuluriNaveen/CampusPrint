import { PrismaClient, PaperSize, ColourMode, DuplexMode, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CampusPrint Database Seeding...');

  // 1. Seed System Settings
  const defaultSettings = [
    { key: 'INSTITUTE_NAME', value: 'CampusPrint Educational Institute', description: 'Name of the university / institution' },
    { key: 'MAX_UPLOAD_SIZE_MB', value: '25', description: 'Maximum single file upload size in MB' },
    { key: 'ALLOWED_FILE_TYPES', value: 'pdf,docx,doc,pptx,ppt,jpg,png', description: 'Allowed document MIME types' },
    { key: 'SUPPORT_EMAIL', value: 'support@campusprint.edu', description: 'Student support contact email' },
    { key: 'PRINTER_DESK_LOCATION', value: 'Central Library, Ground Floor, Desk #01', description: 'Physical print collection desk' },
    { key: 'TAX_GST_PERCENTAGE', value: '18.0', description: 'Default GST percentage for print jobs' },
  ];

  console.log('📦 Seeding System Settings...');
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }

  // 2. Seed Default Pricing Matrix
  console.log('💲 Seeding Default Print Pricing Matrix...');
  const pricingEntries = [
    // A4
    { paperSize: PaperSize.A4, colourMode: ColourMode.BW, duplexMode: DuplexMode.SINGLE, basePrice: 2.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.A4, colourMode: ColourMode.BW, duplexMode: DuplexMode.DOUBLE, basePrice: 3.5, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.A4, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.SINGLE, basePrice: 10.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.A4, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.DOUBLE, basePrice: 18.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    // A3
    { paperSize: PaperSize.A3, colourMode: ColourMode.BW, duplexMode: DuplexMode.SINGLE, basePrice: 5.0, bindingPrice: 30.0, laminationPrice: 25.0 },
    { paperSize: PaperSize.A3, colourMode: ColourMode.BW, duplexMode: DuplexMode.DOUBLE, basePrice: 8.5, bindingPrice: 30.0, laminationPrice: 25.0 },
    { paperSize: PaperSize.A3, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.SINGLE, basePrice: 22.0, bindingPrice: 30.0, laminationPrice: 25.0 },
    { paperSize: PaperSize.A3, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.DOUBLE, basePrice: 38.0, bindingPrice: 30.0, laminationPrice: 25.0 },
    // Letter
    { paperSize: PaperSize.LETTER, colourMode: ColourMode.BW, duplexMode: DuplexMode.SINGLE, basePrice: 2.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.LETTER, colourMode: ColourMode.BW, duplexMode: DuplexMode.DOUBLE, basePrice: 3.5, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.LETTER, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.SINGLE, basePrice: 10.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    { paperSize: PaperSize.LETTER, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.DOUBLE, basePrice: 18.0, bindingPrice: 20.0, laminationPrice: 15.0 },
    // Legal
    { paperSize: PaperSize.LEGAL, colourMode: ColourMode.BW, duplexMode: DuplexMode.SINGLE, basePrice: 3.0, bindingPrice: 25.0, laminationPrice: 20.0 },
    { paperSize: PaperSize.LEGAL, colourMode: ColourMode.BW, duplexMode: DuplexMode.DOUBLE, basePrice: 5.0, bindingPrice: 25.0, laminationPrice: 20.0 },
    { paperSize: PaperSize.LEGAL, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.SINGLE, basePrice: 15.0, bindingPrice: 25.0, laminationPrice: 20.0 },
    { paperSize: PaperSize.LEGAL, colourMode: ColourMode.COLOUR, duplexMode: DuplexMode.DOUBLE, basePrice: 26.0, bindingPrice: 25.0, laminationPrice: 20.0 },
  ];

  for (const entry of pricingEntries) {
    await prisma.pricing.upsert({
      where: {
        paperSize_colourMode_duplexMode: {
          paperSize: entry.paperSize,
          colourMode: entry.colourMode,
          duplexMode: entry.duplexMode,
        },
      },
      update: {
        basePrice: entry.basePrice,
        bindingPrice: entry.bindingPrice,
        laminationPrice: entry.laminationPrice,
      },
      create: entry,
    });
  }

  // 3. Seed Default System Admin Account Placeholder
  console.log('👤 Seeding System Super Admin Account Placeholder...');
  await prisma.user.upsert({
    where: { email: 'admin@campusprint.edu' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@campusprint.edu',
      password: '$2b$10$UnX4u8iP6H29FvGq.3wE2uV94R7.N6wOqJ3YnL8zK0P1M2N3O4P5Q', // Placeholder hashed secret
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      department: 'IT Operations',
    },
  });

  console.log('✅ CampusPrint Database Seeding Completed Successfully.');
}

main()
  .catch(e => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
