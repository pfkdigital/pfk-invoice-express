import z from 'zod';

export const CreateUserSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.email('Invalid email format'),
  userPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long'),
  userAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});

export const UpdateUserSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.email('Invalid email format'),
  userPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long'),
  userAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
});
export type CreateClientDto = z.infer<typeof CreateUserSchema>;
export type UpdateClientDto = z.infer<typeof UpdateUserSchema>;
