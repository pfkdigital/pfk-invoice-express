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
  id?: string;
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

export type ClientQueries = {
  search?: string;
  sort?: 'asc' | 'desc';
};
