
import { handleToken } from "./handleCheck";
import { decode } from "./tokenCheck";

export const context = {
    context: async ({ req, res }) => {
        const token = handleToken(req.headers.authorization as string);
        if (token) {
            const loggedUser = decode(token)
            return (loggedUser) ? { user: loggedUser } : { user: null }
        } else {
            return { user: null }
        }
    }
}