export interface CreateInvoiceDto {
  invoiceReference: string;
  description: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  totalAmount?: number;
  clientId: string;
  invoiceItems: InvoiceItemDto[];
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
