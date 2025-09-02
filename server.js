const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
const uri = "mongodb+srv://maityabir040:s03qu2Z4oA8IMgLs@cluster0.o9ynclx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
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