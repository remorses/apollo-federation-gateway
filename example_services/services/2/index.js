const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type User {
    name: String
  }

  extend type Query {
    bot: Bot
  }
  extend type Bot @key(fields: "id") {
    id: ID @external
    name: String
  }
  extend type Extendable {
    c: Int
  }
`;


const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers: {
        Query: {
          bot: () => ({
            id: 7887,
            name: 'name',
          })
        }
      }
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
