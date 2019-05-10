export default `
  type AppUser {
    name: String!
    height (unit: String = "METER"): Float
    age: Int!
  }

  type Message {
    id: ID!
    type: String!
    name: String!
    content: String!
  }
  
  type AppMaker {
    name: String!
    weight: Float!
  }
  
  union User = AppUser | AppMaker

  type Query {
    "return Smooch app users"
    appUsers: [AppUser!]!
    
    "return all Smooch app makers"
    appMakers: [AppMaker!]!


    "All users of Smooch"
    users: [User!]!

    messages: [Message!]!

    go: String!
  }

  type Mutation {
    postMessage (type: String = "appUsers", name: String!, content: String!): Message!
  }

  type Subscription {
    message: Message
  }
`;
