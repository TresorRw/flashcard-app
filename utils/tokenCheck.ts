import jwt from "jsonwebtoken";
import { tokenPayload } from "../interfaces/User.js";
import { config } from "dotenv";
config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

// encrypting function
export const encode = (payload: tokenPayload) => {
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30d' });
    return token;
}

export const decode = (token: string) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        return payload;
    } catch (e) {
        return e;
    }
}