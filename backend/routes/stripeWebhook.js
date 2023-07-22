import express from "express";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const router = express.Router();

router.post(
    "/",
    express.raw({ type: "application/json" }),
    asyncHandler(async (request, response) => {
        const sig = request.headers["stripe-signature"];
        let event;
        let data;
        let eventType;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            console.log(err.message);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        data = event.data.object;
        eventType = event.type;

        // Handle the event
        if (eventType == "checkout.session.completed") {
            const customer = await stripe.customers.retrieve(data.customer);

            const result = await User.findByIdAndUpdate(
                customer.metadata.userId,
                { $inc: { credit: customer.metadata.creditsPurchased } },
                { new: true }
            );
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send().end();
    })
);

export default router;
