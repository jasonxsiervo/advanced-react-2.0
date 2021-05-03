import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';

function createClient({ headers, initialState }) {
  return new ApolloClient({
    // error-handling link
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            // console logs the error message like wrong password
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          // console logs error related to back end problems
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      // separate package, taken apollo-http-link and layered another code to handle file upload
      createUploadLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        // when fetches data, does cookies is also included?
        fetchOptions: {
          credentials: 'include',
        },
        // pass the headers along from this request. This enables SSR with logged in state
        // also removes the flicker when logging in
        headers,
      }),
    ]),
    // asks you where you will store the cache
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: We will add this together!
            // allProducts: paginationField(),
          },
        },
      },
      // restores the inital state; if there is initial state, store it
    }).restore(initialState || {}),
  });
}

// getDataFromTree - crawl all the pages and look for queries we have and make sure we have fetched everything
// and wait untl everything is fetched
export default withApollo(createClient, { getDataFromTree });
