export type ApiResponse<TData> = {
  data: TData;
  message?: string;
};

export type PaginatedResponse<TData> = {
  data: TData[];
  page: number;
  perPage: number;
  total: number;
};
