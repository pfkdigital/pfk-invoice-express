export interface CreateInvoiceDto {
  invoiceReference: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  userId: string;
  items: InvoiceItemDto[];
}

export interface UpdateInvoiceDto {
  invoiceReference?: string;
  status?: InvoiceStatus;
  invoiceDate?: string;
  dueDate?: string;
  items?: InvoiceItemDto[];
}

export interface InvoiceItemDto {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}
