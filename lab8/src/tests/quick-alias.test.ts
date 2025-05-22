import { describe, test, expect, jest } from '@jest/globals';
import { ShopApi } from '../api/ShopApi';
import { Product } from '../model/Product';
import { baseUrl, validProductMinCategoryId } from './cases';
import { assertProductValid, assertValidAlias } from './utils';

jest.setTimeout(120000);

describe('Quick Alias Tests', () => {
    const client = new ShopApi(baseUrl);
    
    test('Basic alias generation and duplicate handling', async () => {
        // Уникальное имя базового продукта
        const baseTitle = `Тестовый Продукт ${new Date().getTime()}`;

        // Создаем первый продукт
        const firstProduct: Product = {
            ...validProductMinCategoryId,
            title: baseTitle
        };
        
        console.log(`Creating first product with title: ${baseTitle}`);
        const firstId = await client.addProduct(firstProduct);
        
        try {
            // Получаем созданный продукт и проверяем алиас
            const createdProduct = await client.getByID(firstId);
            
            // Проверяем, что продукт проходит валидацию
            assertProductValid(createdProduct);
            
            // Проверяем, что алиас сгенерирован правильно
            assertValidAlias(createdProduct);
            
            const firstAlias = createdProduct.alias;
            console.log(`First product alias: ${firstAlias}`);
            
            // Создаем второй продукт с тем же заголовком
            const secondProduct: Product = {
                ...validProductMinCategoryId,
                title: baseTitle
            };
            
            console.log(`Creating second product with same title: ${baseTitle}`);
            const secondId = await client.addProduct(secondProduct);
            
            try {
                // Получаем второй продукт и проверяем его алиас
                const secondCreatedProduct = await client.getByID(secondId);
                
                // Проверяем, что продукт проходит валидацию
                assertProductValid(secondCreatedProduct);
                
                // Проверяем, что алиас генерируется с суффиксом -0
                expect(secondCreatedProduct.alias).not.toEqual(firstAlias);
                expect(secondCreatedProduct.alias).toEqual(`${firstAlias}-0`);
                
                // Проверяем, что алиас сгенерирован правильно
                assertValidAlias(secondCreatedProduct, `${firstAlias}-0`);
                
                console.log(`Second product alias: ${secondCreatedProduct.alias}`);
            } finally {
                // Удаляем второй продукт
                await client.deleteProduct(secondId);
                console.log(`Deleted second product with ID: ${secondId}`);
            }
        } finally {
            // Удаляем первый продукт
            await client.deleteProduct(firstId);
            console.log(`Deleted first product with ID: ${firstId}`);
        }
    }, 120000);
}); 