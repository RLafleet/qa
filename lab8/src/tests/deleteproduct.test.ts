import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi, NotFound, ShopApiError } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId } from './cases';
import { assertProductValid, assertProductEquals } from './utils';

jest.setTimeout(120000);

describe('DeleteProduct Tests', () => {
    const client = new ShopApi(baseUrl);

    test('Delete existing product', async () => {
        const simpleProduct: Product = {
            category_id: "2",
            title: "Test Simple Product " + new Date().getTime(), 
            content: "Simple content",
            price: "50",
            old_price: "100",
            status: "1",
            keywords: "test",
            description: "Test description",
            hit: "1"
        };
        
        const id = await client.addProduct(simpleProduct);
        console.log(`Test product created with ID: ${id}`);
        
        const createdProduct = await client.getByID(id);
        
        assertProductValid(createdProduct);
        
        assertProductEquals(createdProduct, simpleProduct, ['id', 'alias']);
        
        await client.deleteProduct(id);
        console.log(`Test product deleted with ID: ${id}`);

        try {
            await client.getByID(id);
            expect('Product should be deleted but was still found').toBeFalsy();
        } catch (error) {
            expect(
                error === NotFound || 
                (error instanceof ShopApiError && error.message === 'not found') ||
                (error instanceof Error && error.message.includes('not found'))
            ).toBe(true);
        }
    }, 120000);

    test('Delete non-existing product', async () => {
        const nonExistingID = "-999999";
        
        await expect(async () => {
            await client.deleteProduct(nonExistingID);
        }).rejects.toBeTruthy();
        
    }, 60000);
});

async function createTestProduct(client: ShopApi): Promise<Product> {
    const id = await client.addProduct(validProductMinCategoryId);
    const product = await client.getByID(id);
    
    assertProductValid(product);
    
    return product;
} 