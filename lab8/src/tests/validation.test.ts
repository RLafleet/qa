import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi, ErrBadRequest } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, commonCategoryID, commonContent, commonTitle, commonPrice, commonOldPrice, commonStatus, commonKeywords, commonDescription, commonHit } from './cases';

jest.setTimeout(120000);

describe('Product Validation Tests', () => {
    const client = new ShopApi(baseUrl);
    
    const validProduct: Product = {
        category_id: commonCategoryID,
        title: `Base Valid Product ${new Date().getTime()}`,
        content: commonContent,
        price: commonPrice,
        old_price: commonOldPrice,
        status: commonStatus,
        keywords: commonKeywords,
        description: commonDescription,
        hit: commonHit
    };

    async function testInvalidValue(fieldName: string, value: string) {
        const product: Product = {
            ...validProduct,
            title: `Invalid ${fieldName} Test ${new Date().getTime()}`
        };
        
        (product as any)[fieldName] = value;
        
        try {
            const id = await client.addProduct(product);
            console.log(`Unexpected success with invalid ${fieldName}=${value}, id=${id}`);
            
            await client.deleteProduct(id);
            
            return false; 
        } catch (error) {
            console.log(`Expected error with invalid ${fieldName}=${value}: ${error}`);
            return true; 
        }
    }

    async function testValidValue(fieldName: string, value: string) {
        const product: Product = {
            ...validProduct,
            title: `Valid ${fieldName} Test ${new Date().getTime()}`
        };
        
        (product as any)[fieldName] = value;
        
        try {
            const id = await client.addProduct(product);
            console.log(`Success with valid ${fieldName}=${value}, id=${id}`);
            
            await client.deleteProduct(id);
            
            return true;
        } catch (error) {
            console.log(`Unexpected error with valid ${fieldName}=${value}: ${error}`);
            return false; 
        }
    }

    describe('Category ID Validation', () => {
        test('Minimum valid category_id (1)', async () => {
            const result = await testValidValue('category_id', '1');
            expect(result).toBe(true);
        }, 60000);

        test('Maximum valid category_id (15)', async () => {
            const result = await testValidValue('category_id', '15');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid category_id (0) - below range', async () => {
            const result = await testInvalidValue('category_id', '0');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid category_id (16) - above range', async () => {
            const result = await testInvalidValue('category_id', '16');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid category_id (abc) - non-numeric', async () => {
            const result = await testInvalidValue('category_id', 'abc');
            expect(result).toBe(true);
        }, 60000);
    });

    describe('Status Validation', () => {
        test('Valid status (0)', async () => {
            const result = await testValidValue('status', '0');
            expect(result).toBe(true);
        }, 60000);

        test('Valid status (1)', async () => {
            const result = await testValidValue('status', '1');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid status (2) - above range', async () => {
            const result = await testInvalidValue('status', '2');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid status (-1) - negative', async () => {
            const result = await testInvalidValue('status', '-1');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid status (abc) - non-numeric', async () => {
            const result = await testInvalidValue('status', 'abc');
            expect(result).toBe(true);
        }, 60000);
    });

    describe('Hit Validation', () => {
        test('Valid hit (0)', async () => {
            const result = await testValidValue('hit', '0');
            expect(result).toBe(true);
        }, 60000);

        test('Valid hit (1)', async () => {
            const result = await testValidValue('hit', '1');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid hit (2) - above range', async () => {
            const result = await testInvalidValue('hit', '2');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid hit (-1) - negative', async () => {
            const result = await testInvalidValue('hit', '-1');
            expect(result).toBe(true);
        }, 60000);
    });

    describe('Price Validation', () => {
        test('Valid price (0)', async () => {
            const result = await testValidValue('price', '0');
            expect(result).toBe(true);
        }, 60000);

        test('Valid price (large number)', async () => {
            const result = await testValidValue('price', '999999');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid price (negative)', async () => {
            const result = await testInvalidValue('price', '-1');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid price (non-numeric)', async () => {
            const result = await testInvalidValue('price', 'abc');
            expect(result).toBe(true);
        }, 60000);
    });

    describe('Old Price Validation', () => {
        test('Valid old_price (0)', async () => {
            const result = await testValidValue('old_price', '0');
            expect(result).toBe(true);
        }, 60000);

        test('Valid old_price (large number)', async () => {
            const result = await testValidValue('old_price', '999999');
            expect(result).toBe(true);
        }, 60000);

        test('Invalid old_price (negative)', async () => {
            const result = await testInvalidValue('old_price', '-1');
            expect(result).toBe(true);
        }, 60000);
    });

    describe('Field Length Validation', () => {
        test('Valid title (max length)', async () => {
            const result = await testValidValue('title', 'A'.repeat(255));
            expect(result).toBe(true);
        }, 60000);

        test('Valid description (max length)', async () => {
            const result = await testValidValue('description', 'A'.repeat(255));
            expect(result).toBe(true);
        }, 60000);

        test('Valid keywords (max length)', async () => {
            const result = await testValidValue('keywords', 'A'.repeat(255));
            expect(result).toBe(true);
        }, 60000);

        test('Valid content (max length)', async () => {
            const result = await testValidValue('content', 'A'.repeat(1000));
            expect(result).toBe(true);
        }, 60000);

        test('Invalid title (too long)', async () => {
            const result = await testInvalidValue('title', 'A'.repeat(256));
            expect(result).toBe(true);
        }, 60000);
    });
}); 