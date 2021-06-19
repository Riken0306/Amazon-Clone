import Header from "../components/Header";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";
import { groupBy } from "lodash";
import { clearBasket } from "../slices/basketSlice";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch();
  const [session] = useSession();
  const router = useRouter();
  const groupedItems = Object.values(groupBy(items, "id"));
  const clearWholeBasket = () => {
    dispatch(clearBasket());
    router.push("/");
  };

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    // Call the Backend to create a checkout session
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items,
      email: session.user.email,
    });

    //Redirect user/customer to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-xl mx-auto">
        {/* Left  */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={200}
            objectFit="contain"
          />

          <div className="flex flex-col space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon Basket is Empty"
                : "Your Shopping Basket"}
            </h1>

            {groupedItems.map((group, i) => (
              <CheckoutProduct
                key={i}
                id={group[0].id}
                title={group[0].title}
                rating={group[0].rating}
                price={group[0].price}
                description={group[0].description}
                category={group[0].category}
                image={group[0].image}
                hasPrime={group[0].hasPrime}
                quantity={group.length}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col bg-white p-10 showdow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal {items.length} items:{" "}
                <span className="font-bold">
                  <Currency quantity={total * 103} currency="INR" />
                </span>
              </h2>

              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-500 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed "
                }`}
              >
                {!session ? "Sign in To Checkout" : "Proceed to Checkout"}
              </button>
              <button className="button mt-2" onClick={clearWholeBasket}>
                Clear the Basket
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
