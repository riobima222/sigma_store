import { productsServices } from "@/services/auth";
import { useEffect, useState } from "react";
import ProductCard from "../../components/layout/productCard";

export interface ProductType {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: StockType[];
}
export interface StockType {
  size: string;
  qwt: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const retriveProducts = async () => {
      const response = await productsServices.getAllProducts();
      setProducts(response.data.data);
    };
    retriveProducts();
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">All Products</h1>
      <div className="flex items-start">
        <div className="flex flex-col max-w-[10em] w-full border-b-2 border-black pb-3">
          <h3 className="text-lg font-bold pt-3">Gender</h3>
          <div className="flex flex-col items center">
            <div className="flex justify-start items-center">
              <input type="checkbox" id="gender-man" className="mr-2" />
              <label htmlFor="gender-man" className="text-sm">
                Man
              </label>
            </div>
            <div className="flex justify-start items-center">
              <input type="checkbox" id="gender-woman" className="mr-2" />
              <label htmlFor="gender-woman" className="text-sm">
                Woman
              </label>
            </div>
          </div>
        </div>
        <div
          className={`${
            products.length > 3 && "justify-center"
          } p-4 w-full flex flex-wrap gap-4`}
        >
          {products.length > 0 &&
            products.map((product: ProductType) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
