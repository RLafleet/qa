import axios, { AxiosInstance } from 'axios';
import { Product } from '../model/Product';

export class ShopApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ShopApiError';
    }
}

export const ErrBadRequest = new ShopApiError('bad request');
export const NotFound = new ShopApiError('not found');

export class ShopApi {
    private readonly baseURL: string;
    private readonly client: AxiosInstance;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 20000 
        });
    }

    public async getByID(id: string): Promise<Product> {
        try {
            const products = await this.listAllProducts();
            
            for (const product of products) {
                if (product.id === id) {
                    return product;
                }
            }
            
            throw NotFound;
        } catch (error) {
            if (error === NotFound || (error instanceof ShopApiError && error.message === NotFound.message)) {
                throw NotFound;
            }
            throw new Error(`Failed to get product by ID: ${error}`);
        }
    }

    public async listAllProducts(): Promise<Product[]> {
        try {
            const response = await this.get('/api/products');
            return response as Product[];
        } catch (error) {
            throw new Error(`Failed to list products: ${error}`);
        }
    }

    public async deleteProduct(id: string): Promise<void> {
        try {
            const path = `/api/deleteproduct?id=${id}`;
            const response = await this.get(path) as { status: number };
            
            if (response.status !== 1) {
                throw ErrBadRequest;
            }
        } catch (error) {
            if (error === ErrBadRequest || (error instanceof ShopApiError && error.message === ErrBadRequest.message)) {
                throw ErrBadRequest;
            }
            throw new Error(`Failed to delete product: ${error}`);
        }
    }

    public async addProduct(product: Product): Promise<string> {
        try {
            const response = await this.post('/api/addproduct', product) as { id: number; status: number };
            
            if (response.status !== 1) {
                throw ErrBadRequest;
            }
            
            return response.id.toString();
        } catch (error) {
            if (error === ErrBadRequest || (error instanceof ShopApiError && error.message === ErrBadRequest.message)) {
                throw ErrBadRequest;
            }
            throw new Error(`Failed to add product: ${error}`);
        }
    }

    public async editProduct(product: Product): Promise<void> {
        try {
            const response = await this.post('/api/editproduct', product) as { status: number };
            
            if (response.status !== 1) {
                throw ErrBadRequest;
            }
        } catch (error) {
            if (error === ErrBadRequest || (error instanceof ShopApiError && error.message === ErrBadRequest.message)) {
                throw ErrBadRequest;
            }
            throw new Error(`Failed to edit product: ${error}`);
        }
    }

    private async get(path: string): Promise<any> {
        try {
            let attempts = 3;
            let lastError;
            
            while (attempts > 0) {
                try {
                    const response = await this.client.get(path);
                    return this.checkError(response.data);
                } catch (error) {
                    lastError = error;
                    attempts--;
                    if (attempts > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            throw lastError;
        } catch (error) {
            throw new Error(`GET request failed: ${error}`);
        }
    }

    private async post(path: string, body: any): Promise<any> {
        try {
            let attempts = 3;
            let lastError;
            
            while (attempts > 0) {
                try {
                    const response = await this.client.post(path, body, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    return this.checkError(response.data);
                } catch (error) {
                    lastError = error;
                    attempts--;
                    if (attempts > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            throw lastError;
        } catch (error) {
            throw new Error(`POST request failed: ${error}`);
        }
    }

    private checkError(data: any): any {
        if (typeof data === 'string' && data.includes('<h1>Произошла ошибка</h1>')) {
            throw ErrBadRequest;
        }
        return data;
    }
} 