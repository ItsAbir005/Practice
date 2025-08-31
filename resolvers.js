const users = [
  { id: "1", name: "Abir Maity", email: "abir@example.com" },
  { id: "2", name: "Alice Johnson", email: "alice@example.com" },
];

const posts = [
  {
    id: "101",
    title: "GraphQL Basics",
    content: "This post explains the basics of GraphQL.",
    authorId: "1",
  },
  {
    id: "102",
    title: "Apollo Server Setup",
    content: "Learn how to set up Apollo Server with Express.",
    authorId: "2",
  },
];

const resolvers = {
  Query: {
    posts: () => posts,
    post: (_, { id }) => posts.find((post) => post.id === id),
  },
  Post: {
    author: (post) => users.find((user) => user.id === post.authorId),
  },
};

module.exports = resolvers;