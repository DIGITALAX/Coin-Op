import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getPrintUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/print`;
  }
  return "/api/graphql/print";
};

const httpLinkPrint = new HttpLink({
  uri: getPrintUri(),
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});

const getFactoryUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/factory`;
  }
  return "/api/graphql/factory";
};

const httpLinkFactory = new HttpLink({
  uri: getFactoryUri(),
});

export const graphFactoryClient = new ApolloClient({
  link: httpLinkFactory,
  cache: new InMemoryCache(),
});
