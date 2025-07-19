import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../../config/prisma';
import { prismaErrorHandler } from '../../handlers/prismaHandler';
import { CreateUserDto, UpdateUserDto } from '../../types/user.types';

export const createUser = async (data: CreateUserDto) => {
  try {
    return await prisma.user.create({
      data: {
        userName: data.userName,
        userEmail: data.userEmail,
        userPhone: data.userPhone,
        userAddress: {
          create: {
            street: data.userAddress.street,
            city: data.userAddress.city,
            country: data.userAddress.country,
            postalCode: data.userAddress.postalCode,
          },
        },
      },
      include: {
        userAddress: true,
      },
    });
  } catch (error) {
    prismaErrorHandler(error);
  }
};

export const getAllUsers = async () => {
  try {
    return await prisma.user.findMany({
      include: {
        userAddress: true,
      },
    });
  } catch (error) {
    prismaErrorHandler(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        userAddress: true,
      },
    });
  } catch (error) {
    prismaErrorHandler(error);
  }
};

export const updateUser = async (id: string, data: UpdateUserDto) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        userName: data.userName,
        userEmail: data.userEmail,
        userPhone: data.userPhone,
        userAddress: {
          update: {
            where: { id: data.userAddress.id },
            data: {
              street: data.userAddress?.street,
              city: data.userAddress?.city,
              country: data.userAddress?.country,
              postalCode: data.userAddress?.postalCode,
            },
          },
        },
      },
    });
  } catch (error) {
    console.log('Error updating user:', error);
    prismaErrorHandler(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    prismaErrorHandler(error);
  }
};
