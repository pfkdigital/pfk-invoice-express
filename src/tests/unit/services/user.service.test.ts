import * as userService from '../../../modules/user/user.service';
import * as userRepository from '../../../modules/user/user.repository';
import { mockCreateUserDto, mockUpdateUserDto, mockUser, mockUsers } from '../../mocks/user.mock';
import { AppError } from '../../../errors/AppError';
import { HttpStatus } from '../../../enums/http-status.enum';

// Mock the repository module
jest.mock('../../../modules/user/user.repository');
const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;

describe('User Service Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      // Act
      const result = await userService.createUser(mockCreateUserDto);

      // Assert
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when repository fails', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.createUser.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(userService.createUser(mockCreateUserDto))
        .rejects.toThrow(AppError);
      
      await expect(userService.createUser(mockCreateUserDto))
        .rejects.toMatchObject({
          message: 'Failed to create user',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw AppError when repository fails', async () => {
      // Arrange
      const repositoryError = new Error('Database error');
      mockUserRepository.getAllUsers.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(userService.getAllUsers())
        .rejects.toThrow(AppError);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      mockUserRepository.getUserById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById('user-123');

      // Assert
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      mockUserRepository.getUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById('non-existent'))
        .rejects.toThrow(AppError);
      
      await expect(userService.getUserById('non-existent'))
        .rejects.toMatchObject({
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
    });

    it('should re-throw AppError from repository', async () => {
      // Arrange
      const appError = new AppError('User not found', HttpStatus.NOT_FOUND);
      mockUserRepository.getUserById.mockRejectedValue(appError);

      // Act & Assert
      await expect(userService.getUserById('user-123'))
        .rejects.toThrow(appError);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser('user-123', mockUpdateUserDto);

      // Assert
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith('user-123', mockUpdateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      mockUserRepository.getUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser('non-existent', mockUpdateUserDto))
        .rejects.toThrow(AppError);
      
      expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser);

      // Act
      const result = await userService.deleteUser('user-123');

      // Assert
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when user not found', async () => {
      // Arrange
      mockUserRepository.getUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser('non-existent'))
        .rejects.toThrow(AppError);
      
      expect(mockUserRepository.deleteUser).not.toHaveBeenCalled();
    });
  });
});