import NProgress from 'nprogress';
import Router from 'next/router';
import '../components/styles/nprogress.css';
import { ApolloProvider } from '@apollo/client';
import withData from '../lib/withData';
import Page from '../components/Page';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

// Component and pageProps are props of the app component
function MyApp({ Component, pageProps, apollo }) {
  // console.log('Components: ', Component);
  // console.log('PageProps: ', pageProps);
  // console.log('apollo: ', apollo);
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

// fetch all the queries passed to the components
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
