import _ from "lodash";
import { PubSub } from "apollo-server-express";
const pubsub = new PubSub();

const TOPIC = "message";

const publish = message => {
  pubsub.publish(TOPIC, { message });
};

const infos = ["info1", "info2", "info3", "done"];

export default {
  AppUser: {
    height: (user, { unit }, { models }) => {
      const { height } = user;
      if (!height || unit === "METER") return height;
      return height * 2.9;
    }
  },
  Query: {
    appUsers: async (root, args, { models }) => {
      return models.get("appUsers").value();
    },

    users: (root, args, { models }) => {
      return _.concat(
        models
          .get("appUsers")
          .value()
          .map(appUser => ({ ...appUser, __typename: "AppUser" })),
        models
          .get("appMakers")
          .value()
          .map(appUser => ({ ...appUser, __typename: "AppMaker" }))
      );
    },
    messages: async (root, args, { models }) => {
      return models.get("messages").value();
    }
  },
  Mutation: {
    postMessage(root, { type, name, content }, { models }) {
      const user = models
        .get(type)
        .find({ name })
        .value();

      if (!user) {
        throw new Error("User doesnt exist");
      }

      publish({ type, name, content });

      const id = `${Date.now()}`;
      models
        .get("messages")
        .push({ id, type, name, content })
        .write();

      return models
        .get("messages")
        .find({ id })
        .value();
    }
  },
  Subscription: {
    message: {
      subscribe: () => pubsub.asyncIterator([TOPIC])
    }
  }
};
