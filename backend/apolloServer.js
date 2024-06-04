// src/server.js

const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const bcrypt = require('bcryptjs');
const sequelize = require('./models/index');
const Product = require('./models/product');
const User = require('./models/user');
const Review = require('./models/review');

const pubsub = new PubSub();
const USER_UPDATED = 'USER_UPDATED';
const PRODUCT_UPDATED = 'PRODUCT_UPDATED';
const REVIEW_DELETED = 'REVIEW_DELETED';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    blocked: Boolean!
    dateJoined: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    unit: String!
    special: Boolean!
  }

  type Review {
    id: ID!
    userId: ID!
    productId: ID!
    reviewText: String!
    rating: Int!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    products: [Product]
    product(id: ID!): Product
    reviews: [Review]
    review(id: ID!): Review
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    updateUser(id: ID!, username: String, email: String, password: String): User
    deleteUser(id: ID!): User
    blockUser(id: ID!): User
    unblockUser(id: ID!): User

    createProduct(name: String!, description: String, price: Float!, unit: String!, special: Boolean!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, unit: String, special: Boolean): Product
    deleteProduct(id: ID!): Product

    createReview(userId: ID!, productId: ID!, reviewText: String!, rating: Int!): Review
    deleteReview(id: ID!): Review
  }

  type Subscription {
    userUpdated: User
    productUpdated: Product
    reviewDeleted: Review
  }
`;

const resolvers = {
  Query: {
    users: () => User.findAll(),
    user: (parent, { id }) => User.findByPk(id),
    products: () => Product.findAll(),
    product: (parent, { id }) => Product.findByPk(id),
    reviews: () => Review.findAll(),
    review: (parent, { id }) => Review.findByPk(id),
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return User.create({ username, email, password: hashedPassword });
    },
    updateUser: async (parent, { id, username, email, password }) => {
      const user = await User.findByPk(id);
      if (user) {
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        await user.save();
        pubsub.publish(USER_UPDATED, { userUpdated: user });
        return user;
      }
      throw new Error('User not found');
    },
    deleteUser: async (parent, { id }) => {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        return user;
      }
      throw new Error('User not found');
    },
    blockUser: async (parent, { id }) => {
      const user = await User.findByPk(id);
      if (user) {
        user.blocked = true;
        await user.save();
        pubsub.publish(USER_UPDATED, { userUpdated: user });
        return user;
      }
      throw new Error('User not found');
    },
    unblockUser: async (parent, { id }) => {
      const user = await User.findByPk(id);
      if (user) {
        user.blocked = false;
        await user.save();
        pubsub.publish(USER_UPDATED, { userUpdated: user });
        return user;
      }
      throw new Error('User not found');
    },

    createProduct: async (parent, { name, description, price, unit, special }) => {
      const product = await Product.create({ name, description, price, unit, special });
      pubsub.publish(PRODUCT_UPDATED, { productUpdated: product });
      return product;
    },
    updateProduct: async (parent, { id, name, description, price, unit, special }) => {
      const product = await Product.findByPk(id);
      if (product) {
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (unit) product.unit = unit;
        if (special !== undefined) product.special = special;
        await product.save();
        pubsub.publish(PRODUCT_UPDATED, { productUpdated: product });
        return product;
      }
      throw new Error('Product not found');
    },
    deleteProduct: async (parent, { id }) => {
      const product = await Product.findByPk(id);
      if (product) {
        await product.destroy();
        pubsub.publish(PRODUCT_UPDATED, { productUpdated: product });
        return product;
      }
      throw new Error('Product not found');
    },

    createReview: async (parent, { userId, productId, reviewText, rating }) => {
      return Review.create({ userId, productId, reviewText, rating });
    },
    deleteReview: async (parent, { id }) => {
      const review = await Review.findByPk(id);
      if (review) {
        await review.destroy();
        pubsub.publish(REVIEW_DELETED, { reviewDeleted: review });
        return review;
      }
      throw new Error('Review not found');
    }
  },
  Subscription: {
    userUpdated: {
      subscribe: () => pubsub.asyncIterator([USER_UPDATED]),
    },
    productUpdated: {
      subscribe: () => pubsub.asyncIterator([PRODUCT_UPDATED]),
    },
    reviewDeleted: {
      subscribe: () => pubsub.asyncIterator([REVIEW_DELETED]),
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
