import React from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const Account = () => {
    const makePayment = async () => {
        const stripe = await loadStripe(
            "pk_test_51NSkhZSCenfCBtQE8ptGzZEF0I7Wde5jJxfzNj3s1L7Z2IKTxk69RHEq9q7lbGQQDV7Eibk3U9IOAV38YZ87vlgf00Z1GOzmG1"
        );

        const session = (await axios.post("/credits/buy-credits", { count: 10 })).data;

        const result = stripe.redirectToCheckout({
            sessionId: session.id,
        });

        console.log(result);

        if (result.error) {
            console.log(result.error);
        }
    };

    return (
        <div>
            Account
            <button onClick={makePayment}>Buy</button>
        </div>
    );
};

export default Account;
