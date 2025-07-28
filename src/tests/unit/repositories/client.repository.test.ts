import * as userRepository from '../../../modules/client/client.repository';
import prisma from '../../../config/prisma';
import {
  mockCreateClientDto,
  mockUpdateClientDto,
  mockClient,
  mockClients,
} from '../../mocks/client.mock';

jest.mock('../../../config/prisma', () => ({
  __esModule: true,
  default: {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('User Repository Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create a user successfully', async () => {
      (mockPrisma.client.create as jest.Mock).mockResolvedValue(mockClient);

      const result = await userRepository.createClient(mockCreateClientDto);

      expect(mockPrisma.client.create).toHaveBeenCalledWith({
        data: {
          clientName: mockCreateClientDto.clientName,
          clientEmail: mockCreateClientDto.clientEmail,
          clientPhone: mockCreateClientDto.clientPhone,
          clientAddress: {
            create: {
              street: mockCreateClientDto.clientAddress.street,
              city: mockCreateClientDto.clientAddress.city,
              country: mockCreateClientDto.clientAddress.country,
              postalCode: mockCreateClientDto.clientAddress.postalCode,
            },
          },
        },
        include: {
          clientAddress: true,
        },
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('getAllClients', () => {
    it('should return all users', async () => {
      (mockPrisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);

      const result = await userRepository.getAllClients();

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
        include: { clientAddress: true },
      });
      expect(result).toEqual(mockClients);
    });

    it('should return empty array when no users exist', async () => {
      (mockPrisma.client.findMany as jest.Mock).mockResolvedValue([]);

      const result = await userRepository.getAllClients();

      expect(result).toEqual([]);
    });
  });

  describe('getClientById', () => {
    it('should return user when found', async () => {
      (mockPrisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);

      const result = await userRepository.getClientById('user-123');

      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: { clientAddress: true, invoices: true },
      });
      expect(result).toEqual(mockClient);
    });

    it('should return null when user not found', async () => {
      (mockPrisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.getClientById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateClient', () => {
    it('should update user successfully', async () => {
      const updatedClient = { ...mockClient, ...mockUpdateClientDto };
      (mockPrisma.client.update as jest.Mock).mockResolvedValue(updatedClient);

      const result = await userRepository.updateClient(
        'user-123',
        mockUpdateClientDto,
      );

      expect(mockPrisma.client.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          clientName: mockUpdateClientDto.clientName,
          clientEmail: mockUpdateClientDto.clientEmail,
          clientPhone: mockUpdateClientDto.clientPhone,
          clientAddress: {
            update: {
              where: { id: mockUpdateClientDto.clientAddress?.id },
              data: {
                street: mockUpdateClientDto.clientAddress.street,
                city: mockUpdateClientDto.clientAddress.city,
                country: mockUpdateClientDto.clientAddress.country,
                postalCode: mockUpdateClientDto.clientAddress.postalCode,
              },
            },
          },
        },
      });
      expect(result).toEqual(updatedClient);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      (mockPrisma.client.delete as jest.Mock).mockResolvedValue(mockClient);

      const result = await userRepository.deleteClient('user-123');

      expect(mockPrisma.client.delete).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual(mockClient);
    });
  });
});
