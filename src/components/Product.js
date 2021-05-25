import Image from "next/image";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_RATING = 5;
const MIN_RATING = 1;
function Product({ id, title, price, description, category, image }) {
  const dispatch = useDispatch();
  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );

  const [hasPrime] = useState(Math.random() < 0.5);

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime,
    };

    dispatch(addToBasket(product));

    toast.success(
      <>
        <span className="font-bold">Added to basket!</span>
        <br />
        {product.title.slice(0, 30)}
        {product.title.length > 30 ? "…" : ""}
      </>,
      {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 20,
        progress: undefined,
      }
    );
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10 border rounded-md group transform motion-reduce:transform-none hover:scale-105">
      <>
        <p className="absolute top-2 right-2 text-xs italic text-gray-400">
          {category}
        </p>
        <Image src={image} width={200} height={200} objectFit="contain" />
        <h4>{title}</h4>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-2">{description}</p>
        <div className="mb-5">
          <Currency quantity={price * 103.17} currency="INR" />
        </div>
        {hasPrime && (
          <div className="flex items-center space-x-2 -mt-5">
            <img src="https://links.papareact.com/fdw" className="w-12" />
            <p className="text-xs text-gray-500">Free Next Day Delivery</p>
          </div>
        )}
        <button className="mt-auto button" onClick={addItemToBasket}>
          Add To Basket
        </button>
      </>
    </div>
  );
}

export default Product;
