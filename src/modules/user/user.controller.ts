import * as userRepository from "./user.repository";
import { Request, Response, NextFunction } from "express";
import { CreateUserDto, UpdateUserDto } from "../../types/user.types";
import { HttpStatus } from "../../enum/http-status.enum";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: CreateUserDto = req.body;
    const user = await userRepository.createUser(data);
    res.status(HttpStatus.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(HttpStatus.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userRepository.getUserById(id);
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data: UpdateUserDto = req.body;
    const user = await userRepository.updateUser(id, data);
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await userRepository.deleteUser(id);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
