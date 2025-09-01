const products = [
  { id: "1", name: "iPhone 14", category: "Electronics", price: 999 },
  { id: "2", name: "Samsung Galaxy", category: "Electronics", price: 899 },
  { id: "3", name: "Nike Shoes", category: "Fashion", price: 120 },
];
const resolvers = {
  Query: {
    products: (parent, args) => {
      if (args.category) {
        return products.filter((product) => product.category === args.category);
      }
      return products; 
    },
    product: (parent, args) => {
      return products.find((product) => product.id === args.id);
    },
  },
};

module.exports = resolvers;