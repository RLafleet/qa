import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi, ErrBadRequest } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId, invalidCases } from './cases';
import { assertProductEquals, assertProductValid, assertValidAlias } from './utils';

jest.setTimeout(120000);

describe('AddProduct Tests', () => {
    const client = new ShopApi(baseUrl);

    test('Add product with minimum category ID', async () => {
        await runValidTestCase(client, validProductMinCategoryId);
    }, 120000);

    test('Add Product with Duplicate Title', async () => {
        const product = {
            ...validProductMinCategoryId,
            title: "Test Duplicate " + new Date().getTime()
        };

        const firstID = await client.addProduct(product);
        console.log(`First product created with ID: ${firstID}`);
        expect(firstID).toBeTruthy();

        const firstCreatedProduct = await client.getByID(firstID);
        expect(firstCreatedProduct).toBeTruthy();

        const secondID = await client.addProduct(product);
        console.log(`Second product created with ID: ${secondID}`);
        expect(secondID).toBeTruthy();

        const secondCreatedProduct = await client.getByID(secondID);
        expect(secondCreatedProduct).toBeTruthy();

        expect(secondCreatedProduct.alias).toEqual(`${firstCreatedProduct.alias}-0`);

        console.log(`Deleting products: ${firstID}, ${secondID}`);
        await client.deleteProduct(firstID);
        await client.deleteProduct(secondID);
    }, 120000);

    test('Add invalid product (invalid category ID)', async () => {
        await runInvalidTestCase(client, invalidCases["invalid_category_id_above_range"]);
    }, 60000);
});

async function runValidTestCase(client: ShopApi, product: Product): Promise<void> {
    const testProduct = {
        ...product,
        title: `Test ${new Date().getTime()}` 
    };
    
    const id = await client.addProduct(testProduct);
    console.log(`Test product created with ID: ${id}`);
    expect(id).toBeTruthy();

    const createdProduct = await client.getByID(id);
    expect(createdProduct).toBeTruthy();

    try {
        assertProductEquals(createdProduct, testProduct, ['id', 'alias']);
        
        assertProductValid(createdProduct);
        
        assertValidAlias(createdProduct);
        
        expect(createdProduct.id).not.toEqual("0");
    } finally {
        console.log(`Deleting test product: ${id}`);
        await client.deleteProduct(createdProduct.id!);
    }
}

async function runInvalidTestCase(client: ShopApi, product: Product): Promise<void> {
    try {
        const result = await client.addProduct(product);
        console.log("Unexpected success:", result);
        expect(true).toBe(false);
    } catch (error) {
        expect(error).toBeTruthy();
    }
} 