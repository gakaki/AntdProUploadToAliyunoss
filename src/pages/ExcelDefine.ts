export interface ExcelListItem {
  id: number;
  name: boolean;
  status: string;
}

export interface ExcelListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ExcelListData {
  list: ExcelListItem[];
  pagination: Partial<ExcelListPagination>;
}

export interface ExcelListParams {
  userId?: number;
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  id?: number;
  pageSize?: number;
  currentPage?: number;
}
