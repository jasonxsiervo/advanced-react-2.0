import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
// import variables in .env file
import 'dotenv/config';
import { insertSeedData } from './seed-data';

// fallback to localhost if you don't have a database online?
const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they should be signed in
  secret: process.env.COOKIE_SECRET,
};

// ability to auth
const { withAuth } = createAuth({
  listKey: 'User', // which schema is responsible for loggin in;user that logs in
  identityField: 'email', // which field will identify the user
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO add in initial roles here
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: DATABASE_URL,
      // TODO add data seeding here
      async onConnect(keystone) {
        console.log('connected to the database!');
        // this will run if the command is 'npm run seed-data'
        if (process.argv.includes('--seed-data')) {
          console.log('seed data!');
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go here
      // same with User: User
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // show the UI only for the people who pass this test
      // In here, you can check the session of the user
      // trying to login
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    // TODO add session values here
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL query
      User: 'id',
    }),
  })
);
