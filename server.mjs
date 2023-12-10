import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import "./config/index.mjs";
import Auth from './routes/Auth.mjs'

// ....server initiallization..

const app = express();
const port = process.env.PORT ||  3002;

//  Middlewares...

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(process.cwd() + "/public" )));


// mongoose initialization...

mongoose.connect('mongodb+srv://hussaintaha620:taha321@cluster0.6rhnkp6.mongodb.net/7girls-club?retryWrites=true&w=majority').then(() => {
  console.log("DB IS CONNECTED");
}).catch((err) => {
  console.log("Error while connecting to the database.", err);
});

// ........APIs.......................


app.use('/auth',Auth);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
