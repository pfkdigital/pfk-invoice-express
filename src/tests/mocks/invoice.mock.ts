import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
} from '../../types/invoice.types';

export const mockCreateInvoiceDto: CreateInvoiceDto = {
  invoiceReference: 'INV-2024-001',
  description: 'Web development services - January 2024',
  status: InvoiceStatus.PENDING,
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  totalAmount: 1500.5,
  clientId: 'user-123',
  invoiceItems: [
    {
      name: 'Website Design',
      description: 'Designing the homepage and landing pages',
      quantity: 1,
      unitPrice: 500.0,
    },
    {
      name: 'Backend Development',
      description: 'Setting up server and database',
      quantity: 1,
      unitPrice: 1000.5,
    },
  ],
};

export const mockUpdateInvoiceDto: UpdateInvoiceDto = {
  invoiceReference: 'INV-2024-001-UPDATED',
  description: 'Updated web development services - January 2024',
  status: InvoiceStatus.PAID,
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-25',
  totalAmount: 1750.75,
  invoiceItems: [
    {
      id: 'item-123',
      name: 'Website Design (Updated)',
      description: 'Enhanced homepage and landing pages with animations',
      quantity: 1,
      unitPrice: 750.0,
    },
    {
      id: 'item-456',
      name: 'Backend Development (Updated)',
      description: 'Advanced server setup with microservices',
      quantity: 1,
      unitPrice: 1000.75,
    },
  ],
};

export const mockInvoice = {
  id: 'invoice-123',
  invoiceReference: 'INV-2024-001',
  description: 'Web development services - January 2024',
  status: InvoiceStatus.PENDING,
  invoiceDate: new Date('2024-01-15'),
  dueDate: new Date('2024-02-15'),
  totalAmount: 1500.5,
  clientId: 'user-123',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  invoiceItems: [
    {
      id: 'item-123',
      name: 'Website Design',
      description: 'Designing the homepage and landing pages',
      quantity: 1,
      unitPrice: 500.0,
      invoiceId: 'invoice-123',
    },
    {
      id: 'item-456',
      name: 'Backend Development',
      description: 'Setting up server and database',
      quantity: 1,
      unitPrice: 1000.5,
      invoiceId: 'invoice-123',
    },
  ],
  client: {
    id: 'user-123',
    clientName: 'john_doe',
    clientEmail: 'john@example.com',
    clientPhone: '+1-555-123-4567',
    clientAddress: [
      {
        id: 'address-123',
        street: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        clientId: 'user-123',
      },
    ],
  },
};

export const mockInvoices = [
  mockInvoice,
  {
    id: 'invoice-456',
    invoiceReference: 'INV-2024-002',
    description: 'Consulting services - February 2024',
    status: InvoiceStatus.PENDING,
    invoiceDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-28'),
    totalAmount: 750.0,
    clientId: 'user-123',
    createdAt: new Date('2024-02-01T09:00:00Z'),
    updatedAt: new Date('2024-02-01T09:00:00Z'),
    invoiceItems: [
      {
        id: 'item-789',
        name: 'Technical Consulting',
        description: 'Architecture review and recommendations',
        quantity: 5,
        unitPrice: 150.0,
        invoiceId: 'invoice-456',
      },
    ],
    client: {
      id: 'user-123',
      clientName: 'john_doe',
      clientEmail: 'john@example.com',
      clientPhone: '+1-555-123-4567',
      clientAddress: [
        {
          id: 'address-123',
          street: '123 Main Street',
          city: 'New York',
          country: 'United States',
          postalCode: '10001',
          clientId: 'user-123',
        },
      ],
    },
  },
  {
    id: 'invoice-789',
    invoiceReference: 'INV-2024-003',
    description: 'Mobile app development - March 2024',
    status: InvoiceStatus.PAID,
    invoiceDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-30'),
    totalAmount: 2250.0,
    clientId: 'user-456',
    createdAt: new Date('2024-03-01T11:00:00Z'),
    updatedAt: new Date('2024-03-15T16:45:00Z'),
    invoiceItems: [
      {
        id: 'item-101',
        name: 'Mobile App Design',
        description: 'UI/UX design for iOS and Android apps',
        quantity: 1,
        unitPrice: 1000.0,
        invoiceId: 'invoice-789',
      },
      {
        id: 'item-102',
        name: 'Mobile App Development',
        description: 'Cross-platform development using React Native',
        quantity: 1,
        unitPrice: 1250.0,
        invoiceId: 'invoice-789',
      },
    ],
    client: {
      id: 'user-456',
      clientName: 'jane_smith',
      clientEmail: 'jane@example.com',
      clientPhone: '+1-555-987-6543',
      clientAddress: [
        {
          id: 'address-456',
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          country: 'United States',
          postalCode: '90210',
          clientId: 'user-456',
        },
      ],
    },
  },
];

export const mockInvoiceWithoutClient = {
  id: 'invoice-123',
  invoiceReference: 'INV-2024-001',
  description: 'Web development services - January 2024',
  status: InvoiceStatus.PENDING,
  invoiceDate: new Date('2024-01-15'),
  dueDate: new Date('2024-02-15'),
  totalAmount: 1500.5,
  clientId: 'user-123',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-15T10:00:00Z'),
  invoiceItems: [
    {
      id: 'item-123',
      name: 'Website Design',
      description: 'Designing the homepage and landing pages',
      quantity: 1,
      unitPrice: 500.0,
      invoiceId: 'invoice-123',
    },
  ],
};

export const mockUpdatedInvoice = {
  id: 'invoice-123',
  invoiceReference: 'INV-2024-001-UPDATED',
  description: 'Updated web development services - January 2024',
  status: InvoiceStatus.PAID,
  invoiceDate: new Date('2024-01-15'),
  dueDate: new Date('2024-02-25'),
  totalAmount: 1750.75,
  clientId: 'user-123',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-16T14:30:00Z'),
  invoiceItems: [
    {
      id: 'item-123',
      name: 'Website Design (Updated)',
      description: 'Enhanced homepage and landing pages with animations',
      quantity: 1,
      unitPrice: 750.0,
      invoiceId: 'invoice-123',
    },
    {
      id: 'item-456',
      name: 'Backend Development (Updated)',
      description: 'Advanced server setup with microservices',
      quantity: 1,
      unitPrice: 1000.75,
      invoiceId: 'invoice-123',
    },
  ],
  client: {
    id: 'user-123',
    clientName: 'john_doe',
    clientEmail: 'john@example.com',
    clientPhone: '+1-555-123-4567',
    clientAddress: [
      {
        id: 'address-123',
        street: '123 Main Street',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        clientId: 'user-123',
      },
    ],
  },
};

export const mockEmptyInvoices: any[] = [];

export const mockPendingInvoices = mockInvoices.filter(
  (invoice) => invoice.status === InvoiceStatus.PENDING,
);
export const mockPaidInvoices = mockInvoices.filter(
  (invoice) => invoice.status === InvoiceStatus.PAID,
);
export const mockInvoicesByClient = mockInvoices.filter(
  (invoice) => invoice.clientId === 'user-123',
);

export const mockInvalidClientId = 'non-existent-client';
export const mockInvalidInvoiceId = 'non-existent-invoice';
export const mockDuplicateInvoiceReference = 'INV-2024-001';

export const mockPrismaErrors = {
  duplicateInvoiceReference: {
    code: 'P2002',
    meta: {
      modelName: 'Invoice',
      target: ['invoiceReference'],
    },
    message: 'Unique constraint failed on the fields: (`invoiceReference`)',
  },
  invalidClientReference: {
    code: 'P2003',
    meta: {
      field_name: 'clientId',
    },
    message: 'Foreign key constraint failed on the field: `clientId`',
  },
  invoiceNotFound: {
    code: 'P2025',
    meta: {
      cause: 'Record to update not found.',
    },
    message:
      'An operation failed because it depends on one or more records that were required but not found.',
  },
};