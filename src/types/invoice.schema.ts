import z from 'zod';

export const CreateInvoiceDtoSchema = z.object({
  invoiceReference: z.string(),
  description: z.string(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']),
  invoiceDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  userId: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    }),
  ),
});

export const UpdateInvoiceDtoSchema = z.object({
  invoiceReference: z.string().optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  invoiceDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      }),
    )
    .optional(),
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceDtoSchema>;
export type UpdateInvoiceDto = z.infer<typeof UpdateInvoiceDtoSchema>;
