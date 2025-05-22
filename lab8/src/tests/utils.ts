import { Product } from '../model/Product';
import { expect } from '@jest/globals';

/**
 * @param actual 
 * @param expected 
 * @param ignoreFields 
 */
export function assertProductEquals(
    actual: Product, 
    expected: Product, 
    ignoreFields: Array<keyof Product> = []
): void {
    expect(actual).toBeTruthy();
    
    if (!ignoreFields.includes('id') && expected.id) {
        expect(actual.id).toEqual(expected.id);
    }
    
    if (!ignoreFields.includes('category_id')) {
        expect(actual.category_id).toEqual(expected.category_id);
    }
    
    if (!ignoreFields.includes('title')) {
        expect(actual.title).toEqual(expected.title);
    }
    
    if (!ignoreFields.includes('alias') && expected.alias) {
        expect(actual.alias).toEqual(expected.alias);
    }
    
    if (!ignoreFields.includes('content')) {
        expect(actual.content).toEqual(expected.content);
    }
    
    if (!ignoreFields.includes('price')) {
        expect(actual.price).toEqual(expected.price);
    }
    
    if (!ignoreFields.includes('old_price')) {
        expect(actual.old_price).toEqual(expected.old_price);
    }
    
    if (!ignoreFields.includes('status')) {
        expect(actual.status).toEqual(expected.status);
    }
    
    if (!ignoreFields.includes('keywords')) {
        expect(actual.keywords).toEqual(expected.keywords);
    }

    if (!ignoreFields.includes('description')) {
        expect(actual.description).toEqual(expected.description);
    }
    
    if (!ignoreFields.includes('hit')) {
        expect(actual.hit).toEqual(expected.hit);
    }
}

/**
 * @param product 
 */
export function assertProductValid(product: Product): void {
    expect(Number(product.category_id)).toBeGreaterThanOrEqual(1);
    expect(Number(product.category_id)).toBeLessThanOrEqual(15);
    
    expect(['0', '1']).toContain(product.status);
    
    expect(['0', '1']).toContain(product.hit);
    
    if (product.alias) {
        expect(product.alias).toMatch(/^[a-z0-9-]+$/);
    }
    
    expect(product.title.length).toBeGreaterThan(0);
}

/**
 * @param product 
 * @param expectedPrefix 
 */
export function assertValidAlias(product: Product, expectedPrefix?: string): void {
    expect(product.alias).toBeTruthy();
    
    expect(product.alias).toMatch(/^[a-z0-9-]+$/);
    
    if (expectedPrefix) {
        expect(product.alias).toEqual(expect.stringContaining(expectedPrefix));
    }
    
    expect(product.alias!.length).toBeGreaterThan(0);
} 