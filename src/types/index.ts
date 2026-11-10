export interface UrlData {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  urls?: UrlData[];
  url?: UrlData;
}

export interface CreateUrlRequest {
  originalUrl: string;
}

export interface CreateUrlResponse {
  url: UrlData;
}