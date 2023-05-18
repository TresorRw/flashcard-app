import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./schemas/resolvers";
import { typeDefs } from "./schemas/typeDefs";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { handleToken } from "./utils/handleCheck";
import { decode } from "./utils/tokenCheck";
import { AppContext } from "./interfaces/AppContext";
config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const server = new ApolloServer<AppContext>({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

server
    .start()
    .then(() => {
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
        app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}/graphql`));
    })