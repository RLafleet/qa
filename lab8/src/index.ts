import { ShopApi } from './api/ShopApi';
import { Product } from './model/Product';

async function main() {
    const api = new ShopApi('http://shop.qatl.ru');
    
    try {
        const product: Product = {
            category_id: "5",
            title: "Test Product TS",
            content: "This is a test product created using TypeScript",
            price: "100",
            old_price: "150",
            status: "1",
            keywords: "test, typescript, product",
            description: "Test product description",
            hit: "1"
        };
        
        console.log("Adding product...");
        const id = await api.addProduct(product);
        console.log(`Product added with ID: ${id}`);
        
        console.log("Getting product...");
        const createdProduct = await api.getByID(id);
        console.log("Created product:", createdProduct);
        
        console.log("Editing product...");
        const updatedProduct: Product = {
            ...createdProduct,
            title: "Updated Product Title",
            price: "120"
        };
        
        await api.editProduct(updatedProduct);
        
        console.log("Getting updated product...");
        const editedProduct = await api.getByID(id);
        console.log("Updated product:", editedProduct);
        
        console.log("Deleting product...");
        await api.deleteProduct(id);
        console.log("Product deleted");
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error); 