export interface CreateClientDto {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
}

export interface UpdateClientDto {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: {
    id: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
}