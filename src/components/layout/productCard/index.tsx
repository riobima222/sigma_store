import Button from "@/components/ui/button";
import { ProductType, StockType } from "../../../pages/product";
import { convertPrice } from "@/utils/convertPrice";
import Link from "next/link";
import Image from "next/image";

interface PropsType {
  product: ProductType;
  key: number;
}

const ProductCard = (props: PropsType) => {
  const { product, key } = props;
  return (
    <div
      key={key}
      className="flex flex-col justify-between border-2 p-2 w-[13em] text-white rounded-md bg-slate-700 shadow-md shadow-black"
    >
      <Link href={`/product/${product.id}`} className="block">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="object-cover h-[8em] w-full mb-2"
        />
        <h3 className="text-lg">{product.name}</h3>
        <span className="text-sm">{product.category}</span>
        {product.stock.map((stock: StockType, i: number) => (
          <div key={i} className="text-black flex mb-2 justify-between">
            <span className="flex justify-center items-center w-[47%] font-bold bg-white">
              {stock.size}
            </span>
            <span className="flex justify-center items-center w-[47%] bg-white text-end">
              {stock.qwt}
            </span>
          </div>
        ))}
        <span className="ms-2 font-bold">{convertPrice(product.price)}</span>
      </Link>
      <Link
        href={`/product/${product.id}`}
        className="mt-2 h-[2em] bg-black flex justify-center items-center"
      >
        Detail
      </Link>
    </div>
  );
};
export default ProductCard;
