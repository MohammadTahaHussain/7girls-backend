// Import the Drawing model
import mongoose from "mongoose";
import Drawing from "../modal/designIdSchema.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "../config/index.mjs";
import User from "../modal/userSchema.mjs";
import Stripe from "stripe";
import Design from "../modal/designIdSchema.mjs";
import { auth, db } from '../config/firebase.config.mjs'
import { onSnapshot, query, collection, where, updateDoc, doc } from "firebase/firestore";
import SessionIds from "../modal/sessionIds.mjs";

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


const handlePaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.query;
    const { uid } = req.query
    const { plan } = req.query

    if (!session_id || !uid || !plan) {
      return res.status(404).send({message: 'Invalid request'})
    }

    let docId = null
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          data: doc.data(),
          id: doc.id
        });
      });
      if (users?.length) {
        docId = users[0].id
      }else{
        res.status(400).send({message: 'user not found'})
      }
    });



    // Retrieve the session using the Stripe API
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    // Check the payment status and handle accordingly
    if (session.payment_status === 'paid') {
      console.log('Amount paid:', paymentIntent.amount_received);
      // Payment was successful
      const response = await SessionIds.create({
        session_id
      })

      if (!response) {
        return res.status(404).send({ message: 'beta baaz ajao' })
      }

      if (response) {
        const docRef = doc(db, "users", docId);
        await updateDoc(docRef, {
          membership: {
            status: true,
            plan: plan,
            session_id: session_id
          }
        });
      }
      return res.status(200).json({ status: 'success' });
    } else {
      // Payment failed or was canceled
      console.log('Payment failed or canceled');
      return res.status(200).json({ status: 'failed' });
    }
  } catch (error) {
    // console.error('Error handling payment status:', error);
    return res.status(500).json({ error: error.message });
  }
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
      success_url: `https://7girls-frontend.vercel.app/success?session_id={CHECKOUT_SESSION_ID}&plan=${req.body.items[0]?.name}&uid=${req.body?.items[0]?.uid}`,
      cancel_url: "https://7girls-frontend.vercel.app/members",
      // success_url: `http://7girls-frontend.vercel.app/success?session_id={CHECKOUT_SESSION_ID}&plan=${req.body.items[0]?.name}&uid=${req.body?.items[0]?.uid}`,
      // cancel_url: "https://7girls-frontend.vercel.app/members",      
    });
    res.json({ url: sessions.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export { createUser, LoginUser, checkOut, handlePaymentStatus };
