import { Request, Response, NextFunction } from 'express';
import * as invoiceService from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../types/invoice.types';
import { HttpStatus } from '../../enums/http-status.enum';

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CreateInvoiceDto = req.body;
    const invoice = await invoiceService.createInvoice(data);
    res.status(HttpStatus.CREATED).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(HttpStatus.OK).json(invoices);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);
    res.status(HttpStatus.OK).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data: UpdateInvoiceDto = req.body;
    const updatedInvoice = await invoiceService.updateInvoice(id, data);
    res.status(HttpStatus.OK).json(updatedInvoice);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const getInvoiceCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const count = await invoiceService.getInvoiceCount();
    res.status(HttpStatus.OK).json({ count });
  } catch (error) {
    next(error);
  }
};

export const getTotalAmount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalAmount = await invoiceService.getTotalAmount();
    res.status(HttpStatus.OK).json({ totalAmount });
  } catch (error) {
    next(error);
  }
};

export const getTotalAmountUnpaid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalAmountUnpaid = await invoiceService.getTotalAmountUnpaid();
    res.status(HttpStatus.OK).json({ totalAmountUnpaid });
  } catch (error) {
    next(error);
  }
};
