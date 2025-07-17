export interface CreateUserDto {
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
}

export interface UpdateUserDto {
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: {
    id: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
  }
}