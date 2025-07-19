import { Request, Response, NextFunction } from 'express';
import * as userController from '../../../modules/user/user.controller';
import * as userService from '../../../modules/user/user.service';
import { mockCreateUserDto, mockUpdateUserDto, mockUser, mockUsers } from '../../mocks/user.mock';
import { HttpStatus } from '../../../enums/http-status.enum';
import { AppError } from '../../../errors/AppError';

// Mock the service module
jest.mock('../../../modules/user/user.service');
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('User Controller Functions', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {},
      params: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    
    mockNext = jest.fn();
  });

  describe('createUser', () => {
    it('should create user and return 201', async () => {
      // Arrange
      mockRequest.body = mockCreateUserDto;
      mockUserService.createUser.mockResolvedValue(mockUser);

      // Act
      await userController.createUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call next with AppError when service throws AppError', async () => {
      // Arrange
      mockRequest.body = mockCreateUserDto;
      const appError = new AppError('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
      mockUserService.createUser.mockRejectedValue(appError);

      // Act
      await userController.createUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(appError);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with 200', async () => {
      // Arrange
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      await userController.getAllUsers(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should call next with AppError when service fails', async () => {
      // Arrange
      const appError = new AppError('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
      mockUserService.getAllUsers.mockRejectedValue(appError);

      // Act
      await userController.getAllUsers(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to retrieve users',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      }));
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      // Act
      await userController.getUserById(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockUserService.getUserById).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call next with AppError when user not found', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent' };
      const notFoundError = new AppError('User not found', HttpStatus.NOT_FOUND);
      mockUserService.getUserById.mockRejectedValue(notFoundError);

      // Act
      await userController.getUserById(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND
      }));
    });

    it('should call next with AppError when service fails', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      const serviceError = new AppError('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
      mockUserService.getUserById.mockRejectedValue(serviceError);

      // Act
      await userController.getUserById(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to retrieve user',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      }));
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = mockUpdateUserDto;
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      // Act
      await userController.updateUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockUserService.updateUser).toHaveBeenCalledWith('user-123', mockUpdateUserDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should call next with AppError when user not found', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = mockUpdateUserDto;
      const notFoundError = new AppError('User not found', HttpStatus.NOT_FOUND);
      mockUserService.updateUser.mockRejectedValue(notFoundError);

      // Act
      await userController.updateUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND
      }));
    });

    it('should call next with AppError when service fails', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      mockRequest.body = mockUpdateUserDto;
      const serviceError = new AppError('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
      mockUserService.updateUser.mockRejectedValue(serviceError);

      // Act
      await userController.updateUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to update user',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      }));
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return 204', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      mockUserService.deleteUser.mockResolvedValue(mockUser);

      // Act
      await userController.deleteUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with AppError when user not found', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent' };
      const notFoundError = new AppError('User not found', HttpStatus.NOT_FOUND);
      mockUserService.deleteUser.mockRejectedValue(notFoundError);

      // Act
      await userController.deleteUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND
      }));
    });

    it('should call next with AppError when service fails', async () => {
      // Arrange
      mockRequest.params = { id: 'user-123' };
      const serviceError = new AppError('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
      mockUserService.deleteUser.mockRejectedValue(serviceError);

      // Act
      await userController.deleteUser(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Failed to delete user',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      }));
    });
  });
});