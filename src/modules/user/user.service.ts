import { CreateUserDto, UpdateUserDto } from '../../types/user.types';
import * as userRepository from './user.repository';
import { AppError } from '../../errors/AppError';
import { HttpStatus } from '../../enum/http-status.enum';

export const createUser = async (data: CreateUserDto) => {
  try {
    return await userRepository.createUser(data);
  } catch (error) {
    throw new AppError(
      'Failed to create user',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getAllUsers = async () => {
  try {
    return await userRepository.getAllUsers();
  } catch (error) {
    throw new AppError(
      'Failed to retrieve users',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Failed to retrieve user',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateUser = async (id: string, data: UpdateUserDto) => {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return await userRepository.updateUser(id, data);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Failed to update user',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
    return await userRepository.deleteUser(id);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Failed to delete user',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
