import { Request, Response, NextFunction } from 'express';
import * as invoiceService from './invoice.service';
import { CreateInvoiceDto, InvoiceQueries, UpdateInvoiceDto } from '../../types/invoice.types';
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
    const { page, limit, search, sort } = req.query as InvoiceQueries;
    const invoices = await invoiceService.getAllInvoices(page, limit, search || '', sort || 'asc');
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