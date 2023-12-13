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
      payment_method_types: ["card"],
      mode: "payment", // Corrected typo here
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `http://7girls-frontend.vercel.app/success?session_id={CHECKOUT_SESSION_ID}&plan=${req.body.items[0]?.name}&uid=${req.body?.items[0]?.uid}`,
      cancel_url: "https://7girls-frontend.vercel.app/members",
    });

    console.log('sessions status' sessions?.status || 'not found')

    console.log('sessions =>', sessions)

    res.json({ url: sessions.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createUser, LoginUser, checkOut };
