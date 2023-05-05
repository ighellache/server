// how we integrate an apollo server into an express application
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);
// cors is used to add response headers to allow cross-origin requests
//express.json() parses the request body into javascript object(JSON)
//authMiddleware takes care of authentication

app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf8");

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use("/graphql", apolloMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
