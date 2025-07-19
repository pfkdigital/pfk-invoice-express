export const mockCreateUserDto = {
  userName: 'john_doe',
  userEmail: 'john@example.com',
  userPhone: '+1-555-123-4567',
  userAddress: {
    street: '123 Main Street',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
  },
};

export const mockUpdateUserDto = {
  userName: 'john_updated',
  userEmail: 'john.updated@example.com',
  userPhone: '+1-555-123-9999',
  userAddress: {
    id: 'address-123',
    street: '456 Updated Street',
    city: 'Boston',
    country: 'United States',
    postalCode: '02101',
  },
};

export const mockUser = {
  id: 'user-123',
  userName: 'john_doe',
  userEmail: 'john@example.com',
  userPhone: '+1-555-123-4567',
  userAddress: [
    {
      id: 'address-123',
      street: '123 Main Street',
      city: 'New York',
      country: 'United States',
      postalCode: '10001',
      userId: 'user-123',
    },
  ],
  invoices: [],
};

export const mockUsers = [mockUser];
