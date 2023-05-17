import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./schemas/resolvers.js";
import { typeDefs } from "./schemas/typeDefs.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { PrismaClient } from "@prisma/client";
import { handleToken } from "./utils/handleCheck.js";
import { decode } from "./utils/tokenCheck.js";
import { AppContext } from "./interfaces/AppContext.js";
config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const server = new ApolloServer<AppContext>({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});


await server.start();

app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
        const token = handleToken(req.headers.authorization as string);
        if (token) {
            const loggedUser = decode(token)
            return (loggedUser) ? { user: loggedUser } : { user: null }
        } else {
            return { user: null }
        }
    },
}))

prisma
    .$connect()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}/graphql`));
    })
    .catch((error) => console.error(error));
