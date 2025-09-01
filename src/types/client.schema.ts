import z from 'zod';

export const CreateClientSchema = z.object({
  clientName: z.string().min(1, 'User name is required'),
  clientEmail: z.email('Invalid email format'),
  clientPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long'),
  clientAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});

export const UpdateClientSchema = z.object({
  clientName: z.string().min(1, 'User name is required'),
  clientEmail: z.email('Invalid email format'),
  clientPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long'),
  clientAddress: z.object({
    id: z.string().min(1, 'Address ID is required').optional(),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});
export type CreateClientDto = z.infer<typeof CreateClientSchema>;
export type UpdateClientDto = z.infer<typeof UpdateClientSchema>;
