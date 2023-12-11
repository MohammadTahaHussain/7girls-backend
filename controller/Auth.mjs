// Import the Drawing model
import mongoose from "mongoose";
import Drawing from "../modal/designIdSchema.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "../config/index.mjs";
import User from "../modal/userSchema.mjs";
import Stripe from "stripe";
import Design from "../modal/designIdSchema.mjs";
const stripe = new Stripe('sk_test_51Nsoi4JNIfFBCw6D9VvsUIxl3IpIIfAMOkn9PaFHjBEzvVIi40S3OseeEYewmCU8afY6lF6X7jrEFxkIbrzlUFsX005xGS2rmi', {
  apiVersion: "2020-08-27",
});
import express from 'express'
const app = express()

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exist" });
    }

    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.json({ error: "User Not Found!" });
  }

  if (await bcrypt.compare(password, checkUser.password)) {
    const token = jwt.sign(
      { email: checkUser.email },
      process.env.JWT_SECRET_KEY
    );
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  return res.json({ status: "error", error: "Invalid Password" });
};


const checkOut = async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.create({
      // ... (your existing code)

      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&plan=${req.body.items[0]?.name}&uid=${req.body?.items[0]?.uid}`,
      cancel_url: "http://localhost:3000/members",
    });

    res.json({ url: sessions.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Handle Stripe webhook events
app.post('/webhook/stripe', async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, "whsec_QsIuwmmzwKFKGnXEzYpH3B8jU1oZNomU");
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Perform any actions you want here
    console.log('Alhamdulillah')

    console.log('Payment successful! Session ID:', session.id);
  }

  res.status(200).end();
});

export { createUser, LoginUser, checkOut };