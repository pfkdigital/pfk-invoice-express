import { PrismaClient } from '../generated/prisma';
import { InvoiceStatus } from '../generated/prisma';

const prisma = new PrismaClient();

// Helper function to generate random dates
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random invoice reference
const generateInvoiceRef = (index: number): string => {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(index).padStart(4, '0')}`;
};

// Sample companies and their details
const companies = [
  { name: 'TechCorp Solutions', email: 'billing@techcorp.com', phone: '+1-555-0101', country: 'United States' },
  { name: 'Global Industries Ltd', email: 'accounts@globalind.com', phone: '+44-20-7946-0958', country: 'United Kingdom' },
  { name: 'Innovation Labs Inc', email: 'finance@innovlabs.com', phone: '+1-555-0102', country: 'United States' },
  { name: 'Digital Marketing Pro', email: 'billing@digipro.com', phone: '+1-555-0103', country: 'United States' },
  { name: 'European Consulting GmbH', email: 'rechnungen@euroconsult.de', phone: '+49-30-12345678', country: 'Germany' },
  { name: 'Startup Accelerator', email: 'payments@startupaccel.com', phone: '+1-555-0104', country: 'United States' },
  { name: 'Manufacturing Plus', email: 'ap@manuplus.com', phone: '+1-555-0105', country: 'United States' },
  { name: 'Creative Agency Co', email: 'billing@creativeagency.com', phone: '+1-555-0106', country: 'United States' },
  { name: 'Financial Services Ltd', email: 'invoices@finserv.co.uk', phone: '+44-161-496-0123', country: 'United Kingdom' },
  { name: 'E-commerce Solutions', email: 'accounting@ecomsol.com', phone: '+1-555-0107', country: 'United States' },
  { name: 'Healthcare Systems', email: 'billing@healthsys.com', phone: '+1-555-0108', country: 'United States' },
  { name: 'Education Platform Inc', email: 'finance@eduplatform.com', phone: '+1-555-0109', country: 'United States' },
  { name: 'Logistics Network', email: 'payments@loginet.com', phone: '+1-555-0110', country: 'United States' },
  { name: 'Restaurant Chain Ltd', email: 'accounting@restchain.com', phone: '+1-555-0111', country: 'United States' },
  { name: 'Construction Corp', email: 'billing@constcorp.com', phone: '+1-555-0112', country: 'United States' },
  { name: 'Media Production House', email: 'finance@mediaprod.com', phone: '+1-555-0113', country: 'United States' },
  { name: 'Automotive Solutions', email: 'ap@autosol.com', phone: '+1-555-0114', country: 'United States' },
  { name: 'Fashion Retail Inc', email: 'billing@fashionret.com', phone: '+1-555-0115', country: 'United States' },
  { name: 'Travel Agency Pro', email: 'accounting@travelpro.com', phone: '+1-555-0116', country: 'United States' },
  { name: 'Sports Equipment Ltd', email: 'finance@sportseq.com', phone: '+1-555-0117', country: 'United States' },
  { name: 'Real Estate Holdings', email: 'billing@realestate.com', phone: '+1-555-0118', country: 'United States' },
  { name: 'Insurance Partners', email: 'payments@inspartners.com', phone: '+1-555-0119', country: 'United States' },
  { name: 'Telecommunications Inc', email: 'billing@telecom.com', phone: '+1-555-0120', country: 'United States' },
  { name: 'Energy Solutions Co', email: 'accounting@energysol.com', phone: '+1-555-0121', country: 'United States' },
  { name: 'Pharmaceutical Research', email: 'finance@pharmaresearch.com', phone: '+1-555-0122', country: 'United States' },
];

// Sample streets for addresses
const streets = [
  '123 Main Street', '456 Oak Avenue', '789 Pine Road', '321 Elm Drive', '654 Maple Lane',
  '987 Cedar Boulevard', '147 Birch Way', '258 Willow Court', '369 Spruce Avenue', '741 Ash Street',
  '852 Hickory Lane', '963 Poplar Drive', '159 Walnut Road', '357 Cherry Street', '486 Dogwood Avenue',
  '753 Magnolia Way', '951 Sycamore Court', '753 Redwood Drive', '482 Cypress Lane', '629 Juniper Street'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
  'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Charlotte', 'Fort Worth',
  'Indianapolis', 'Seattle', 'Denver', 'Boston', 'London', 'Manchester', 'Birmingham', 'Liverpool',
  'Berlin', 'Munich', 'Hamburg', 'Frankfurt'
];

// Service/Product items for invoices
const serviceItems = [
  { name: 'Web Development', basePrice: 125, description: 'Custom website development and maintenance' },
  { name: 'Mobile App Development', basePrice: 150, description: 'iOS and Android application development' },
  { name: 'UI/UX Design', basePrice: 95, description: 'User interface and experience design services' },
  { name: 'Digital Marketing', basePrice: 85, description: 'SEO, SEM, and social media marketing' },
  { name: 'Consulting Services', basePrice: 175, description: 'Strategic business and technology consulting' },
  { name: 'Data Analytics', basePrice: 135, description: 'Business intelligence and data analysis' },
  { name: 'Cloud Infrastructure', basePrice: 200, description: 'AWS, Azure, and GCP setup and management' },
  { name: 'API Development', basePrice: 140, description: 'RESTful API design and implementation' },
  { name: 'Database Design', basePrice: 120, description: 'Database architecture and optimization' },
  { name: 'DevOps Services', basePrice: 160, description: 'CI/CD pipeline setup and maintenance' },
  { name: 'Security Audit', basePrice: 180, description: 'Cybersecurity assessment and recommendations' },
  { name: 'Training Services', basePrice: 90, description: 'Technical training and workshops' },
  { name: 'Project Management', basePrice: 110, description: 'Agile project management and coordination' },
  { name: 'Quality Assurance', basePrice: 85, description: 'Software testing and quality assurance' },
  { name: 'Technical Writing', basePrice: 75, description: 'Documentation and technical content creation' },
  { name: 'System Integration', basePrice: 155, description: 'Third-party system integration services' },
  { name: 'Performance Optimization', basePrice: 145, description: 'Application and system performance tuning' },
  { name: 'Maintenance & Support', basePrice: 95, description: 'Ongoing technical support and maintenance' },
];

const descriptions = [
  'Monthly retainer for ongoing development work',
  'Project-based development services',
  'Emergency bug fixes and critical updates',
  'New feature development and implementation',
  'System upgrade and migration services',
  'Annual maintenance and support contract',
  'Custom integration with third-party services',
  'Performance optimization and scaling',
  'Security enhancements and compliance updates',
  'Training and documentation services',
];

async function main() {
  console.log('🌱 Starting to seed the database...');

  // Clear existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.address.deleteMany();
  await prisma.client.deleteMany();

  console.log('👥 Creating clients...');
  const clients = [];
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const client = await prisma.client.create({
      data: {
        clientName: company.name,
        clientEmail: company.email,
        clientPhone: company.phone,
        clientAddress: {
          create: {
            street: streets[Math.floor(Math.random() * streets.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            postalCode: Math.floor(Math.random() * 90000 + 10000).toString(),
            country: company.country,
          },
        },
      },
    });
    clients.push(client);
  }

  console.log(`✅ Created ${clients.length} clients`);

  console.log('📄 Creating invoices with items...');
  let totalInvoices = 0;
  let totalItems = 0;

  // Create invoices for the past 18 months
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 18);
  const endDate = new Date();

  for (const client of clients) {
    // Each client gets between 3-12 invoices
    const invoiceCount = Math.floor(Math.random() * 10) + 3;
    
    for (let i = 0; i < invoiceCount; i++) {
      totalInvoices++;
      const invoiceDate = getRandomDate(startDate, endDate);
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 30) + 15)); // 15-45 days

      // Determine status based on due date
      let status: InvoiceStatus;
      const now = new Date();
      if (dueDate < now) {
        // 70% of overdue invoices are actually paid, 30% are overdue
        status = Math.random() < 0.7 ? InvoiceStatus.PAID : InvoiceStatus.OVERDUE;
      } else {
        // For future due dates, 80% paid, 20% pending
        status = Math.random() < 0.8 ? InvoiceStatus.PAID : InvoiceStatus.PENDING;
      }

      // Create invoice items (2-8 items per invoice)
      const itemCount = Math.floor(Math.random() * 7) + 2;
      const invoiceItems = [];
      let totalAmount = 0;

      for (let j = 0; j < itemCount; j++) {
        const serviceItem = serviceItems[Math.floor(Math.random() * serviceItems.length)];
        const quantity = Math.floor(Math.random() * 50) + 1; // 1-50 hours/units
        const unitPrice = serviceItem.basePrice + (Math.random() * 50 - 25); // ±$25 variation
        const finalUnitPrice = Math.max(50, Math.round(unitPrice * 100) / 100); // Minimum $50, round to cents
        
        totalAmount += quantity * finalUnitPrice;
        totalItems++;

        invoiceItems.push({
          name: serviceItem.name,
          description: serviceItem.description,
          quantity,
          unitPrice: finalUnitPrice,
        });
      }

      await prisma.invoice.create({
        data: {
          invoiceReference: generateInvoiceRef(totalInvoices),
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          status,
          invoiceDate,
          dueDate,
          totalAmount: Math.round(totalAmount * 100) / 100, // Round to cents
          clientId: client.id,
          invoiceItems: {
            create: invoiceItems,
          },
        },
      });
    }
  }

  console.log(`✅ Created ${totalInvoices} invoices with ${totalItems} items`);

  // Generate some statistics
  const stats = await prisma.invoice.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
    _sum: {
      totalAmount: true,
    },
  });

  console.log('\n📊 Database Statistics:');
  console.log(`Total Clients: ${clients.length}`);
  console.log(`Total Invoices: ${totalInvoices}`);
  console.log(`Total Invoice Items: ${totalItems}`);
  console.log('\nInvoice Status Breakdown:');
  
  for (const stat of stats) {
    console.log(`${stat.status}: ${stat._count.status} invoices, $${stat._sum.totalAmount?.toFixed(2)} total`);
  }

  const totalRevenue = stats.reduce((sum, stat) => sum + (stat._sum.totalAmount || 0), 0);
  console.log(`\n💰 Total Revenue: $${totalRevenue.toFixed(2)}`);

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
