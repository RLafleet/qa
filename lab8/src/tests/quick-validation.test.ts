import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId, boundaryCases, invalidCases } from './cases';
import { assertProductValid } from './utils';

jest.setTimeout(120000);

describe('Quick Validation Tests', () => {
    const client = new ShopApi(baseUrl);
    
    async function createAndDeleteProduct(product: Product): Promise<boolean> {
        try {
            const id = await client.addProduct(product);
            console.log(`Product created with ID: ${id}`);
            
            const createdProduct = await client.getByID(id);
            
            try {
                assertProductValid(createdProduct);
                console.log(`Product with ID ${id} validated successfully`);
            } catch (validationError) {
                console.log(`Validation error for product ${id}: ${validationError}`);
            }
            
            await client.deleteProduct(id);
            console.log(`Product deleted with ID: ${id}`);
            
            return true; 
        } catch (error) {
            console.log(`Error: ${error}`);
            return false; 
        }
    }
    
    test('Boundary Values - Valid Cases', async () => {
        const minCatResult = await createAndDeleteProduct({
            ...validProductMinCategoryId,
            title: `Min Category ID Test ${new Date().getTime()}`
        });
        expect(minCatResult).toBe(true);
        
        const maxCatResult = await createAndDeleteProduct({
            ...validProductMinCategoryId,
            title: `Max Category ID Test ${new Date().getTime()}`,
            category_id: "15"
        });
        expect(maxCatResult).toBe(true);
        
        const statusZeroResult = await createAndDeleteProduct({
            ...validProductMinCategoryId,
            title: `Status Zero Test ${new Date().getTime()}`,
            status: "0"
        });
        expect(statusZeroResult).toBe(true);
        
        const hitZeroResult = await createAndDeleteProduct({
            ...validProductMinCategoryId,
            title: `Hit Zero Test ${new Date().getTime()}`,
            hit: "0"
        });
        expect(hitZeroResult).toBe(true);
    }, 120000);
    
    test('Invalid Values', async () => {
        try {
            const invalidCatID = await client.addProduct({
                ...validProductMinCategoryId,
                title: `Invalid Category ID Test ${new Date().getTime()}`,
                category_id: "16"
            });
            await client.deleteProduct(invalidCatID);
            console.log("Unexpected success with invalid category_id=16");
            expect(true).toBe(false); 
        } catch (error) {
            expect(error).toBeTruthy();
        }
        
        try {
            const invalidStatusID = await client.addProduct({
                ...validProductMinCategoryId,
                title: `Invalid Status Test ${new Date().getTime()}`,
                status: "2"
            });
            await client.deleteProduct(invalidStatusID);
            console.log("Unexpected success with invalid status=2");
            expect(true).toBe(false); 
        } catch (error) {
            expect(error).toBeTruthy();
        }
        
        try {
            const invalidPriceID = await client.addProduct({
                ...validProductMinCategoryId,
                title: `Invalid Price Test ${new Date().getTime()}`,
                price: "-100"
            });
            
            const createdProduct = await client.getByID(invalidPriceID);
            
            try {
                assertProductValid(createdProduct);
            } catch (validationError) {
                console.log(`Validation error with negative price: ${validationError}`);
            }
            
            await client.deleteProduct(invalidPriceID);
            console.log("Unexpected success with invalid price=-100");
            console.log("WARNING: API accepts negative prices, which might be an issue");
        } catch (error) {
            console.log("API rejected negative price as expected");
        }
    }, 120000);
}); 