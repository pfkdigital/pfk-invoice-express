import * as userRepository from '../../../modules/user/user.repository';
import prisma from '../../../config/prisma';
import {
  mockCreateUserDto,
  mockUpdateUserDto,
  mockUser,
  mockUsers,
} from '../../mocks/user.mock';
import { PrismaError } from '../../../errors/PrismaError';
import { HttpStatus } from '../../../enums/http-status.enum';

// Mock the entire Prisma client
jest.mock('../../../config/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock the prisma error handler
jest.mock('../../../handlers/prismaHandler', () => ({
  prismaErrorHandler: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('User Repository Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.createUser(mockCreateUserDto);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          userName: mockCreateUserDto.userName,
          userEmail: mockCreateUserDto.userEmail,
          userPhone: mockCreateUserDto.userPhone,
          userAddress: {
            create: {
              street: mockCreateUserDto.userAddress.street,
              city: mockCreateUserDto.userAddress.city,
              country: mockCreateUserDto.userAddress.country,
              postalCode: mockCreateUserDto.userAddress.postalCode,
            },
          },
        },
        include: {
          userAddress: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should call prismaErrorHandler when database error occurs', async () => {
      const prismaError = {
        code: 'P2002',
        meta: { target: ['userName'] },
        message: 'Unique constraint failed',
      };
      (mockPrisma.user.create as jest.Mock).mockRejectedValue(prismaError);

      const { prismaErrorHandler } = require('../../../handlers/prismaHandler');
      prismaErrorHandler.mockImplementation(() => {
        throw new PrismaError(
          'Failed to create user',
          prismaError.code,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

      await expect(
        userRepository.createUser(mockCreateUserDto),
      ).rejects.toThrow(PrismaError);

      expect(prismaErrorHandler).toHaveBeenCalledWith(prismaError);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      (mockPrisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userRepository.getAllUsers();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        include: { userAddress: true },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await userRepository.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.getUserById('user-123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: { userAddress: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.getUserById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      (mockPrisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser(
        'user-123',
        mockUpdateUserDto,
      );

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          userName: mockUpdateUserDto.userName,
          userEmail: mockUpdateUserDto.userEmail,
          userPhone: mockUpdateUserDto.userPhone,
          userAddress: {
            update: {
              where: { id: mockUpdateUserDto.userAddress.id },
              data: {
                street: mockUpdateUserDto.userAddress.street,
                city: mockUpdateUserDto.userAddress.city,
                country: mockUpdateUserDto.userAddress.country,
                postalCode: mockUpdateUserDto.userAddress.postalCode,
              },
            },
          },
        },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      (mockPrisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.deleteUser('user-123');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
