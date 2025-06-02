export interface ListQueryParams {
  userId?: number;
  page: number;
  pagesize: number;
  orderBy: 'recent' | 'id';
  keyword?: string;
  likedOnly: boolean;
}
