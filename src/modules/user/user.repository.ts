import prisma from '../../config/prisma';
import { CreateUserDto, UpdateUserDto } from '../../types/user.types';

export const createUser = async (data: CreateUserDto) =>
  await prisma.user.create({
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
  });

export const getAllUsers = async () =>
  await prisma.user.findMany({
    include: {
      userAddress: true,
    },
  });

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: { id },
    include: {
      userAddress: true,
    },
  });

export const updateUser = async (id: string, data: UpdateUserDto) =>
  await prisma.user.update({
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

export const deleteUser = async (id: string) =>
  await prisma.user.delete({
    where: { id },
  });
