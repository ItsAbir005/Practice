const { gql } = require("apollo-server-express");
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
    }
    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
    }
    type Query {
        posts: [Post!]!
        post(id: ID!): Post

    }
`;
module.exports = typeDefs;