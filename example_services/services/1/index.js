const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    ok: Boolean
  }
  type Scripts {
    name: Int
  }
  type Bot @key(fields: "id") {
    id: ID
    usernmae: String
  }
  type Extendable {
    a: Int
    b: Int
  }
`;


const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers: {
        Bot: {
          __resolveReference: (x) => {
            return { id: 9797, __typename: 'Bot'}
          }
        }
      }
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
