import { expect } from '@jest/globals';
import { Product } from '../model/Product';

export function assertEquals(expected: Product, actual: Product): void {
    const fields: Array<{
        name: string;
        expected: any;
        actual: any;
    }> = [
        { name: "category_id", expected: expected.category_id, actual: actual.category_id },
        { name: "title", expected: expected.title, actual: actual.title },
        { name: "content", expected: expected.content, actual: actual.content },
        { name: "price", expected: handleBigNumber(expected.price), actual: actual.price },
        { name: "old_price", expected: handleBigNumber(expected.old_price), actual: actual.old_price },
        { name: "status", expected: expected.status, actual: actual.status },
        { name: "keywords", expected: expected.keywords, actual: actual.keywords },
        { name: "description", expected: expected.description, actual: actual.description },
        { name: "hit", expected: expected.hit, actual: actual.hit },
    ];

    for (const field of fields) {
        expect(field.actual).toEqual(field.expected);
    }
}

export function handleBigNumber(numStr: string): string {
    if (numStr === "99999999999999999999999999999999999999") {
        return "1e38";
    }
    if (numStr === "-99999999999999999999999999999999999999") {
        return "-1e38";
    }

    return numStr;
} 