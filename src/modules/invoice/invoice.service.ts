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

export const getAllInvoices = async () => {
  try {
    return await invoiceRepository.getAllInvoices();
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

export const getInvoiceCount = async () => {
  try {
    return await invoiceRepository.countInvoices();
  } catch (error) {
    errorHandler(error);
  }
};
export const getTotalAmount = async () => {
  try {
    return await invoiceRepository.getTotalAmount();
  } catch (error) {
    errorHandler(error);
  }
};

export const getTotalAmountUnpaid = async () => {
  try {
    return await invoiceRepository.getTotalAmountUnpaid();
  } catch (error) {
    errorHandler(error);
  }
};
