const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);
const resolvers = {
  Query: {
    products: async () => {
      return await Product.find();
    },
    product: async (_, { id }) => {
      return await Product.findById(id);
    },
  },
  Mutation: {
    addProduct: async (_, { name, category, price }) => {
      const newProduct = new Product({ name, category, price });
      return await newProduct.save();
    },
    updateProduct: async (_, { id, name, category, price }) => {
      return await Product.findByIdAndUpdate( id, { name, category, price }, { new: true } );
    },
    deleteProduct: async (_, { id }) => {
      return await Product.findByIdAndDelete(id);
    },
  },
};

module.exports = resolvers;