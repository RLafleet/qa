import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi, ErrBadRequest } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId, invalidCases } from './cases';
import { assertProductEquals, assertProductValid } from './utils';

jest.setTimeout(120000); 

describe('EditProduct Tests', () => {
    const client = new ShopApi(baseUrl);

    test('Valid Edit Product', async () => {
        const testProduct = {
            ...validProductMinCategoryId,
            title: `Test Edit ${new Date().getTime()}` 
        };
        
        const id = await client.addProduct(testProduct);
        console.log(`Test product created with ID: ${id}`);
        
        try {
            const createdProduct = await client.getByID(id);
            
            assertProductEquals(createdProduct, testProduct, ['id', 'alias']);
            
            const updatedProduct = {
                ...createdProduct,
                title: `Updated ${new Date().getTime()}`,
                price: "150"
            };
            
            await client.editProduct(updatedProduct);
            console.log(`Product updated: ${id}`);
            
            const result = await client.getByID(id);
            
            assertProductEquals(result, updatedProduct);
            
            assertProductValid(result);
        } finally {
            await client.deleteProduct(id);
            console.log(`Test product deleted: ${id}`);
        }
    }, 120000);

    test('Invalid Edit Product', async () => {
        const testProduct = {
            ...validProductMinCategoryId,
            title: `Test Invalid Edit ${new Date().getTime()}` 
        };
        
        const id = await client.addProduct(testProduct);
        console.log(`Test product created with ID: ${id}`);
        
        try {
            const createdProduct = await client.getByID(id);
            
            const invalidProduct = {
                ...createdProduct,
                category_id: "99" 
            };
            
            try {
                await client.editProduct(invalidProduct);
                console.log("Unexpected success updating invalid product");
                expect(true).toBe(false); 
            } catch (error) {
                expect(error).toBeTruthy();
            }
            
            const unchangedProduct = await client.getByID(id);
            expect(unchangedProduct.category_id).toEqual(createdProduct.category_id);
            
            assertProductEquals(unchangedProduct, createdProduct);
        } finally {
            await client.deleteProduct(id);
            console.log(`Test product deleted: ${id}`);
        }
    }, 120000);
}); 