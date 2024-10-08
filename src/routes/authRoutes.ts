import express from "express";
import { check } from "express-validator";
import * as controller from  '../controllers/authControllers';


const router = express.Router();

router.post("/register",[
    check("name", "Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isString(),
    check("bio", "Bio is required").isString(),

], controller.registerUser);

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isString(),
], controller.loginUser);

export default router;