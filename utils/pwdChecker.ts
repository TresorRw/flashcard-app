import bcrypt from "bcrypt";
import { config } from "dotenv";
config()

const ROUNDS = parseInt(process.env.SALT_ROUNDS as string) | 12;

export function hashString(password: string) {
    bcrypt.hash(password, ROUNDS, function (err, hash) {
        return hash;
    })
}