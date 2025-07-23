export const mockCreateClientDto = {
  clientName: 'john_doe',
  clientEmail: 'john@example.com',
  clientPhone: '+1-555-123-4567',
  clientAddress: {
    street: '123 Main Street',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
  },
};

export const mockUpdateClientDto = {
  clientName: 'john_updated',
  clientEmail: 'john.updated@example.com',
  clientPhone: '+1-555-123-9999',
  clientAddress: {
    id: 'address-123',
    street: '456 Updated Street',
    city: 'Boston',
    country: 'United States',
    postalCode: '02101',
  },
};

export const mockClient = {
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
  invoices: [],
};

export const mockClients = [mockClient];
