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
config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use("/graphql", expressMiddleware(server));

prisma
    .$connect()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}/graphql`));
    })
    .catch((error) => console.error(error));
