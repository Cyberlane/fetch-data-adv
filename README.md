[![Version](http://img.shields.io/npm/v/fetch-data-adv.svg)](https://www.npmjs.org/package/fetch-data-adv)
[![npm](https://img.shields.io/npm/dt/fetch-data-adv.svg)](Downloads)

# fetch-data-adv

A helper function for React Components, allowing you to pre-fetch data before loading your component and offering the option to display a loading component while promises are being resolved.

Please note that this package depends on you having [cancelable-fetch-adv](https://www.npmjs.com/package/cancelable-fetch-adv)

Usage:

```jsx
import React, { Component } from 'react';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { connect } from 'react-redux';
import { refresh } from 'actions/user';

@connect(
  state => ({
    email: state.user.email,
  }),
)
@fetchData(
  ({ email }) => ({
    refreshUser: refresh(email),
  }),
  LoadingSpinner,
)
class MyComponent extends Component {
  render() {
    return (
      <p>Loading complete!</p>
    );
  }
}
```
