import axios from 'axios';
import React, { useState } from 'react';

interface Product {
    productName: string;
    brand: string;
    description?: string;
}

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([
        { productName: "Instant Rice", brand: "Koka" },
        { productName: "Black Neck Cord with Buckle", brand: "Univet" },
        { productName: "Graphene Waterproof Sleep Protectors", brand: "Equilibrium Tencel" },
    ]);

    const enrichProduct = async (product: Product) => {
        try {
            const response = await axios.post('http://localhost:5000/enrich', {
                productName: product.productName,
                brand: product.brand,
            });

            const updatedProduct = response.data;
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.productName === product.productName ? { ...p, ...updatedProduct } : p
                )
            );
        } catch (error) {
            console.error("Failed to enrich product:", error);
        }
    };

    return (
        <div>
            <h1>Product List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Brand</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.productName}</td>
                            <td>{product.brand}</td>
                            <td>{product.description || "No description available"}</td>
                            <td>
                                <button onClick={() => enrichProduct(product)}>Enrich</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
