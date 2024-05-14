import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/E2M1NyxMJ7xNhiY6S7HNUMPNE7ihdP95kTEuj5pqup9j`,
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLinkTestnet = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/coinop_test/v0.0.35",
});

export const graphClientTestnet = new ApolloClient({
  link: httpLinkTestnet,
  cache: new InMemoryCache(),
});

const httpLinkPrint = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/DcuUkg3QC5zg1t86VeNjWzg6R6ohaGa8QGyVE1rFYMZB`,
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});
