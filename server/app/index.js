import "@babel/polyfill";
const { makeExecutableSchema } = require("graphql-tools");
import express from "express";
import { ApolloServer } from "apollo-server-express";
import low from "lowdb";
import http from "http";

import schema from "./schema";
import resolvers from "./resolvers";

// Database
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("../db.json");
const db = low(adapter);

db.defaults({
  appUsers: [],
  messages: [],
  appMakers: []
}).write();

// Graphql server
const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs: schema, resolvers }),
  context: async ({ req }) => {
    return { models: db, req };
  }
});

// Express
const app = express();

const httpServer = http.createServer(app);

// Apply graphql middleware
server.applyMiddleware({ app, path: "/graphql" });

// Apply websocket
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, function() {
  console.log("Apigateway listening on port 4000!");
  console.log(
    `🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
  );
});
