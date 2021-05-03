import { select, relationship, text, integer } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Product = list({
  // TODO
  // access
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      // change the UI
      ui: {
        displayMode: 'segmented-control',
        // hides the status field
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer(),
    // TODO photo
  },
});
