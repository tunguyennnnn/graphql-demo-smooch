import "@babel/polyfill";
const { makeExecutableSchema } = require("graphql-tools");
import express from "express";
import { ApolloServer } from "apollo-server-express";
import low from "lowdb";
import http from "http";

import schema from "./schema";
import resolvers from "./resolvers";

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("../db.json");
const db = low(adapter);

db.defaults({
  appUsers: [
    {
      name: "Tu",
      age: 18
    },
    {
      name: "Jm",
      age: 20,
      height: 1.87
    },
    {
      name: "Andrew",
      age: 19,
      height: 1.9
    },
    {
      name: "Mike",
      age: 18,
      height: 1.7
    },
    {
      name: "Dhia",
      age: 19,
      height: 1.8
    }
  ],
  messages: [],
  appMakers: [
    {
      name: "JP",
      weight: 65.5
    },
    {
      name: "Debie",
      weight: 55
    }
  ]
}).write();

const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs: schema, resolvers }),
  context: async ({ req }) => {
    return { models: db, req };
  }
});

const app = express();

const httpServer = http.createServer(app);
server.applyMiddleware({ app, path: "/graphql" });
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, function() {
  console.log("Apigateway listening on port 4000!");
  console.log(
    `🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
  );
});
