import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId } from './cases';
import { assertProductValid, assertValidAlias } from './utils';

jest.setTimeout(120000);

describe('Alias Generation Tests', () => {
    const client = new ShopApi(baseUrl);
    
    test('Basic alias generation from title (transliteration)', async () => {
        const russianTitleProduct: Product = {
            ...validProductMinCategoryId,
            title: `Тестовый Продукт ${new Date().getTime()}`  
        };
        
        const id = await client.addProduct(russianTitleProduct);
        console.log(`Product created with ID: ${id}`);
        
        try {
            const createdProduct = await client.getByID(id);
            
            assertProductValid(createdProduct);
            
            assertValidAlias(createdProduct);
            
            console.log(`Generated alias: ${createdProduct.alias} for title: ${russianTitleProduct.title}`);
        } finally {
            await client.deleteProduct(id);
            console.log(`Product deleted with ID: ${id}`);
        }
    }, 60000);
    
    test('Duplicate alias handling (adding -0 suffix)', async () => {
        const baseTitle = `Дубликат Алиаса ${new Date().getTime()}`;
        
        const firstProduct: Product = {
            ...validProductMinCategoryId,
            title: baseTitle
        };
        
        const firstId = await client.addProduct(firstProduct);
        console.log(`First product created with ID: ${firstId}`);
        
        try {
            const firstCreatedProduct = await client.getByID(firstId);
            const firstAlias = firstCreatedProduct.alias;
            console.log(`First product alias: ${firstAlias}`);
            
            assertValidAlias(firstCreatedProduct);
            
            const secondProduct: Product = {
                ...validProductMinCategoryId,
                title: baseTitle
            };
            
            const secondId = await client.addProduct(secondProduct);
            console.log(`Second product created with ID: ${secondId}`);
            
            try {
                const secondCreatedProduct = await client.getByID(secondId);
                const secondAlias = secondCreatedProduct.alias;
                console.log(`Second product alias: ${secondAlias}`);
                
                expect(secondAlias).toEqual(`${firstAlias}-0`);
                
                assertValidAlias(secondCreatedProduct);
            } finally {
                await client.deleteProduct(secondId);
                console.log(`Second product deleted with ID: ${secondId}`);
            }
        } finally {
            await client.deleteProduct(firstId);
            console.log(`First product deleted with ID: ${firstId}`);
        }
    }, 60000);
    
    test('Multiple duplicate aliases (sequential suffixes)', async () => {
        const baseTitle = `Множественные Дубликаты ${new Date().getTime()}`;
        const productIds: string[] = [];
        
        try {
            for (let i = 0; i < 3; i++) {
                const product: Product = {
                    ...validProductMinCategoryId,
                    title: baseTitle
                };
                
                const id = await client.addProduct(product);
                productIds.push(id);
                console.log(`Product ${i+1} created with ID: ${id}`);
            }
            
            const products = await Promise.all(
                productIds.map(id => client.getByID(id))
            );
            
            console.log(`Product 1 alias: ${products[0].alias}`);
            console.log(`Product 2 alias: ${products[1].alias}`);
            console.log(`Product 3 alias: ${products[2].alias}`);
            
            products.forEach(product => assertValidAlias(product));
            
            const baseAlias = products[0].alias;
            
            expect(products[1].alias).toEqual(`${baseAlias}-0`);
            
            const expectedSuffixes = [`${baseAlias}-1`, `${baseAlias}-0-0`];
            expect(expectedSuffixes).toContain(products[2].alias);
        } finally {
            for (const id of productIds) {
                await client.deleteProduct(id);
                console.log(`Product deleted with ID: ${id}`);
            }
        }
    }, 120000);

    test('Transliteration of special characters in title', async () => {
        const specialTitleProduct: Product = {
            ...validProductMinCategoryId,
            title: `Тест!@#$%^&*()_+№ ${new Date().getTime()}`
        };
        
        const id = await client.addProduct(specialTitleProduct);
        console.log(`Product created with ID: ${id}`);
        
        try {
            const createdProduct = await client.getByID(id);
            
            assertProductValid(createdProduct);
            
            assertValidAlias(createdProduct);
            
            console.log(`Generated alias: ${createdProduct.alias} for title with special chars: ${specialTitleProduct.title}`);
        } finally {
            await client.deleteProduct(id);
            console.log(`Product deleted with ID: ${id}`);
        }
    }, 60000);
}); 