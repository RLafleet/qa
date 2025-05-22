declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
  }

  export interface AxiosError<T = any> extends Error {
    config: any;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
  }

  export function isAxiosError(payload: any): payload is AxiosError;
  
  export function get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>>;
  export function post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  export function put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  export function deleteRequest<T = any>(url: string, config?: any): Promise<AxiosResponse<T>>;

  const axios: {
    get: typeof get;
    post: typeof post;
    put: typeof put;
    delete: typeof deleteRequest;
    isAxiosError: typeof isAxiosError;
  };

  export default axios;
}