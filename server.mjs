import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import "./config/index.mjs";
import Auth from './routes/Auth.mjs'
import { db } from './config/firebase.config.mjs'
import { collection, query, where, getDocs } from "firebase/firestore";

// ....server initiallization..

const app = express();
const port = process.env.PORT || 3002;

//  Middlewares...

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(process.cwd() + "/public" )));

const getData = async () => {
  const q = query(collection(db, "users"), where("uid", "==", "1RYfo6WQ7oO4XiyhYVsmSjioSLp1"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
}

// mongoose initialization...

mongoose.connect('mongodb+srv://hussaintaha620:taha321@cluster0.6rhnkp6.mongodb.net/7girls-club?retryWrites=true&w=majority').then(() => {
  console.log("DB IS CONNECTED");
  // getData()
}).catch((err) => {
  console.log("Error while connecting to the database.", err);
});

// ........APIs.......................


app.use('/auth', Auth);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
