import bcrypt from "bcrypt";
import { config } from "dotenv";
config()

export async function hashString(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash
}
