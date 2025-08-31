const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
async function startServer() {
  const app = express();
  
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
}
startServer();