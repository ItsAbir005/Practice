const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
async function startServer() {
  const app = express();
  const typeDefs = `#graphql
    type User {
      id: ID!
      name: String!
      email: String!
    }
    type Query {
      users: [User]
    }
  `;
  const resolvers = {
    Query: {
      users: () => [
        { id: "1", name: "Abir", email: "abir@example.com" },
        { id: "2", name: "Riya", email: "riya@example.com" }
      ]
    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
}
startServer();