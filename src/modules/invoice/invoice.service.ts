import * as invoiceRepository from "./invoice.repository";
import { AppError } from "../../errors/AppError";
import { CreateInvoiceDto, UpdateInvoiceDto } from "../../types/invoice.types";
import { HttpStatus } from "../../enums/http-status.enum";

export const createInvoice = async (data: CreateInvoiceDto) => {
  try {
    return await invoiceRepository.createInvoice(data);
  } catch (error) {
    throw new AppError(
      "Failed to create invoice",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAllInvoices = async () => {
  try {
    return await invoiceRepository.getAllInvoices();
  } catch (error) {
    throw new AppError(
      "Failed to retrieve invoices",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError("Invoice not found", HttpStatus.NOT_FOUND);
    }
    return invoice;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to retrieve invoice",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateInvoice = async (id: string, data: UpdateInvoiceDto) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError("Invoice not found", HttpStatus.NOT_FOUND);
    }
    return await invoiceRepository.updateInvoice(id, data);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to update invoice",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const invoice = await invoiceRepository.getInvoiceById(id);
    if (!invoice) {
      throw new AppError("Invoice not found", HttpStatus.NOT_FOUND);
    }
    return await invoiceRepository.deleteInvoice(id);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to delete invoice",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
