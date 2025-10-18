export interface CreateInvoiceDto {
  description: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  totalAmount?: number;
  clientId: string;
  invoiceItems: InvoiceItemDto[];
  // invoiceReference is auto-generated, so not included in create DTO
}

export interface UpdateInvoiceDto {
  invoiceReference?: string;
  description: string;
  status?: InvoiceStatus;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: number;
  invoiceItems?: InvoiceItemDto[];
}

export interface InvoiceItemDto {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export type Queries = {
  page: string;
  limit: string;
  search?: string;
  sort?: 'asc' | 'desc';
};

