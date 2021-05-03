import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

// named export
export const User = list({
  // access:
  // ui:
  fields: {
    // isIndexed will make queries fast, use if it is commonly used
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    // TODO add roles, cart, orders
  },
});
