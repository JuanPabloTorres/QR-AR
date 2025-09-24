export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
};
