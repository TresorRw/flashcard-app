import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./schemas/resolvers";
import { typeDefs } from "./schemas/typeDefs";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import type { AppContext } from "./interfaces/AppContext";
import { context } from "./utils/Context";
config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT: unknown = process.env.PORT;

app.use(cors());
app.use(express.json());

const server: ApolloServer = new ApolloServer<AppContext>({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

server
    .start()
    .then(() => {
        app.use('/graphql', expressMiddleware(server, { context: context.context }))
        app.listen(PORT, () => console.log(`🚀 🛜    http://localhost:${PORT}/graphql`));
    })