import * as invoiceRepository from './invoice.repository';
import { AppError } from '../../errors/AppError';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../types/invoice.types';
import { HttpStatus } from '../../enums/http-status.enum';
import { errorHandler } from '../../handlers/errorHandler';

export const createInvoice = async (data: CreateInvoiceDto) => {
  try {
    return await invoiceRepository.createInvoice(data);
  } catch (error) {
    errorHandler(error);
  }
};

export const getAllInvoices = async (
  page: string,
  limit: string,
  search: string,
  sort: string,
) => {
  try {
    return await invoiceRepository.getAllInvoices(page, limit, search, sort);
  } catch (error) {
    errorHandler(error);
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
    }
    return invoice;
  } catch (error) {
    errorHandler(error);
  }
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDto) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
    }
    return await invoiceRepository.updateInvoice(id, data);
  } catch (error) {
    errorHandler(error);
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError('Invoice not found', HttpStatus.NOT_FOUND);
    }
    return await invoiceRepository.deleteInvoice(id);
  } catch (error) {
    errorHandler(error);
  }
};
