import { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

// try not to think of this as JS because this is GraphQL
// because we can't use JS variables inside of here

// it is important to name our queries and mutations

// indicate w/c mutation get passed in and what types are they

// we need to make this a flexible mutation so
// that we can pass data on data

// remember that photo has is its own type

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in? And What types are they
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Nice shoes',
    price: 23423,
    description: 'These are nice shoes',
  });
  // createProduct is function that will bound to the
  // the CREATE_PRODUCT_MUTATION mutation
  // createProduct is an asynchronous function
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      // pass everything that needs to come along
      // since inputs is named accordingly to what we need
      // to what will be returned by CREATE_PRODUCT_MUTATION
      // it will line up these values right there
      variables: inputs,
    }
  );
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // console.log(inputs);

        // submit the input fields to the backend
        // take notes that variables: inputs
        // is already pre-loaded to the function
        // that's why it can now not be added
        // when calling it, this will keep our
        // code nice and short
        const res = await createProduct();
        console.log(res);
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            //   onChange={(e) => console.log(e.target.value, e.target.name)}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name}
            placeholder="Name"
            //   onChange={(e) => console.log(e.target.value, e.target.name)}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={inputs.description}
            placeholder="Description"
            //   onChange={(e) => console.log(e.target.value, e.target.name)}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            value={inputs.price}
            placeholder="Price"
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <button type="submit">Add Product</button>
    </Form>
  );
}
