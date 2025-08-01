interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  error?: string;
}

export class ApiResponseBuilder<T> {
  private response: ApiResponse<T>;

  constructor(status: number, message: string, data: T) {
    this.response = {
      status,
      message,
      data,
    };
  }

  setError(error: string): ApiResponseBuilder<T> {
    this.response.error = error;
    return this;
  }

  build(): ApiResponse<T> {
    return this.response;
  }
}
