import express from "express";
const router = express.Router();
import { createUser, LoginUser, checkOut } from "../controller/Auth.mjs";

router.get('/', (req, res) => {
  res.status(200).send({
    Name: 'Taha',
    Age : 18
  })
})

router.post("/register", (req, res) => {
  createUser(req, res);
});

router.post("/login", async (req, res) => {
  LoginUser(req, res);
});

router.post("/checkout", async (req, res) => {
  checkOut(req, res);
});

export default router;
