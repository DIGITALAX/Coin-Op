import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const fgoLink = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/2WcnqC9wn2Y33zbXUvTYuFngyddWYfBHsKpCLHrXvBi6`,
});

export const graphFGOClient = new ApolloClient({
  link: fgoLink,
  cache: new InMemoryCache(),
});

const httpLinkPrint = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/5BRsShsfv6tEucvDwGtrstRhg1fpvx2pMRWh5GDovE9K`,
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});

const httpLinkFactory = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/fractional-garment-ownership/version/latest`,
});

export const graphFactoryClient = new ApolloClient({
  link: httpLinkFactory,
  cache: new InMemoryCache(),
});
