const { gql } = require("apollo-server-express");
const typeDefs = gql`
    type product {
        id: ID!
        name: String!
        price: Float!
        category: String!
    }
    type Query {
        products(category: String): [Product!]!
        product(id: ID!): Product
    }
`;
module.exports = typeDefs;