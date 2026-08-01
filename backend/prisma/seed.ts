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
  const bcrypt = await import('bcrypt');
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@campusprint.edu' },
    update: {
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      name: 'System Admin',
      email: 'admin@campusprint.edu',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      department: 'IT Operations',
    },
  });

  // 4. Seed Default Supplier and Inventory Consumables (EP-04)
  console.log('📦 Seeding Inventory Consumables & Suppliers...');
  const defaultSupplier = await prisma.supplier.upsert({
    where: { id: 'sup-default-1' },
    update: {},
    create: {
      id: 'sup-default-1',
      name: 'National Paper & Print Supplies Ltd',
      contactPerson: 'Ramesh Kumar',
      phone: '+91 9876543210',
      email: 'supplies@nationalpaper.co.in',
      address: 'Plot 42, Industrial Area, Sector 18',
    },
  });

  const defaultInventory = [
    {
      sku: 'SKU-PAP-A4',
      name: 'A4 Premium 80GSM Paper Reams',
      category: 'PAPER' as const,
      unit: 'SHEETS',
      currentQuantity: 2500,
      minQuantity: 500,
      maxQuantity: 10000,
      purchasePrice: 0.40,
      location: 'Warehouse Shelf A-1',
      supplierId: defaultSupplier.id,
      status: 'IN_STOCK' as const,
    },
    {
      sku: 'SKU-PAP-A3',
      name: 'A3 Heavyweight 100GSM Sheets',
      category: 'PAPER' as const,
      unit: 'SHEETS',
      currentQuantity: 300,
      minQuantity: 200,
      maxQuantity: 2000,
      purchasePrice: 1.20,
      location: 'Warehouse Shelf A-2',
      supplierId: defaultSupplier.id,
      status: 'IN_STOCK' as const,
    },
    {
      sku: 'SKU-INK-BLK',
      name: 'High-Yield Black Laser Toner Cartridge',
      category: 'INK_TONER' as const,
      unit: 'CARTRIDGES',
      currentQuantity: 4,
      minQuantity: 5,
      maxQuantity: 20,
      purchasePrice: 3500.0,
      location: 'Cabinet B-1',
      supplierId: defaultSupplier.id,
      status: 'LOW_STOCK' as const,
    },
    {
      sku: 'SKU-BND-SPRL',
      name: 'Spiral Binding Plastic Coils (12mm)',
      category: 'BINDING' as const,
      unit: 'UNITS',
      currentQuantity: 150,
      minQuantity: 50,
      maxQuantity: 500,
      purchasePrice: 5.0,
      location: 'Bin C-3',
      supplierId: defaultSupplier.id,
      status: 'IN_STOCK' as const,
    },
    {
      sku: 'SKU-LAM-100U',
      name: 'A4 Lamination Pouch Sheets (125 Micron)',
      category: 'LAMINATION' as const,
      unit: 'SHEETS',
      currentQuantity: 80,
      minQuantity: 100,
      maxQuantity: 500,
      purchasePrice: 4.50,
      location: 'Bin D-2',
      supplierId: defaultSupplier.id,
      status: 'LOW_STOCK' as const,
    },
  ];

  for (const item of defaultInventory) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {
        currentQuantity: item.currentQuantity,
        minQuantity: item.minQuantity,
        purchasePrice: item.purchasePrice,
        status: item.status,
      },
      create: item,
    });
  }

  // --- Seed Default Printer Fleet ---
  const defaultPrinters = [
    {
      name: 'HP LaserJet Enterprise M608',
      code: 'PRN-001',
      printerType: 'LASER',
      manufacturer: 'HP',
      model: 'M608dn',
      supportedPaperSizes: ['A4', 'A5', 'LETTER', 'LEGAL'],
      supportedColorModes: ['BW'],
      supportedDuplex: true,
      status: 'ONLINE' as const,
      location: 'Central Print Hub - Room 101',
      maxDailyCapacity: 3000,
      currentDailyCount: 450,
      isMaintenanceMode: false,
    },
    {
      name: 'Canon ImageRUNNER ADVANCE C5550i',
      code: 'PRN-002',
      printerType: 'DIGITAL_MULTIFUNCTION',
      manufacturer: 'Canon',
      model: 'C5550i III',
      supportedPaperSizes: ['A4', 'A3', 'A5', 'LETTER', 'LEGAL'],
      supportedColorModes: ['BW', 'COLOUR'],
      supportedDuplex: true,
      status: 'ONLINE' as const,
      location: 'Central Print Hub - Room 102',
      maxDailyCapacity: 2500,
      currentDailyCount: 680,
      isMaintenanceMode: false,
    },
    {
      name: 'Epson WorkForce Pro WF-C879R',
      code: 'PRN-003',
      printerType: 'INKJET',
      manufacturer: 'Epson',
      model: 'WF-C879R',
      supportedPaperSizes: ['A4', 'A3', 'LETTER'],
      supportedColorModes: ['BW', 'COLOUR'],
      supportedDuplex: true,
      status: 'IDLE' as const,
      location: 'Student Self-Service Kiosk A',
      maxDailyCapacity: 1500,
      currentDailyCount: 120,
      isMaintenanceMode: false,
    },
    {
      name: 'HP DesignJet T830 Large Format',
      code: 'PRN-004',
      printerType: 'PLOTTER',
      manufacturer: 'HP',
      model: 'DesignJet T830',
      supportedPaperSizes: ['A1', 'A2', 'A3'],
      supportedColorModes: ['BW', 'COLOUR'],
      supportedDuplex: false,
      status: 'MAINTENANCE' as const,
      location: 'Engineering Graphics Lab',
      maxDailyCapacity: 500,
      currentDailyCount: 0,
      isMaintenanceMode: true,
    },
  ];

  for (const printer of defaultPrinters) {
    await prisma.printer.upsert({
      where: { code: printer.code },
      update: printer,
      create: printer,
    });
  }

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
