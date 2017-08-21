import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

function fetchData(dependencyFn, LoadingComponent) {
  return WrappedComponent =>
    class DataProvider extends Component {
      static contextTypes = {
        store: PropTypes.object.isRequired,
      };

      state = {};

      componentWillMount() {
        this._isMounted = true;
        this._fetchData(false);
      }

      componentWillUnmount() {
        this._isMounted = false;
        this._promises.forEach(promise => promise.cancel());
      }

      _isMounted = true;
      _promises = [];

      @autobind
      _fetchData(forceUpdate = true) {
        // Extra props could be injected here from this.context.store.getState();
        // eg:
        // const { authentication: { email } } = this.context.store.getState();
        // const props = { email, ...this.props };
        const props = this.props;
        const componentDependencies = dependencyFn(props, false, forceUpdate);
        const depKeys = Object.keys(componentDependencies);

        depKeys.forEach((depKeys) => {
          const action = componentDependencies[depKey];

          if (action) {
            this.setState({
              [depKey]: {
                isFetchingData: true,
                fetchError: null,
              },
            });

            const fetchPromise = this.context.store.dispatch(action)
              .then(() => this._isMounted && this.setState({ [depKey]: { isFetchingData: false, fetchError: null} }))
              .catch((error) => {
                if (error.isCancelled) {
                  console.warn(`Fetch for dependency '${depKey}' aborted because the parent was unmounted`);
                } else if (this._isMounted) {
                  console.error(error);

                  this.setState({
                    [depKey]: {
                      isFetchingData: false,
                      fetchError: error,
                    },
                  });
                }
              });

            this._promises.push(fetchPromise);
          } else {
            this.setState({
              [depKey]: {
                isFetchingData: false,
                fetchError: null,
              },
            });
          }
        })
      }

      render() {
        const fetchedData = {
          isFetchingData: Object.values(this.state).some(state => state.isFetchingData),
          ...this.state,
        };
        if (fetchedData.isFetchingData && LoadingComponent) {
          return <LoadingComponent loading />;
        }
        return (
          <WrappedComponent
            {...this.props}
            fetchedData={fetchedData}
            fetchData={this._fetchData}
          />
        );
      }
    }
}

export default fetchData;
