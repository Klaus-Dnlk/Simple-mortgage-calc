import React from 'react';
import { CircularProgress, Alert, Box } from '@mui/material';

/**
 * DataFetcher Component - Demonstrates Render Props Pattern
 * 
 * Render Props Pattern allows components to share behavior through a prop that receives a function
 * This component handles data fetching states (loading, error, success) and passes them to children
 * 
 * Usage:
 * <DataFetcher fetchFunction={someAsyncFunction}>
 *   {({ data, loading, error, refetch }) => (
 *     loading ? <Spinner /> : <DataDisplay data={data} />
 *   )}
 * </DataFetcher>
 */
class DataFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Refetch if fetchFunction changes
    if (prevProps.fetchFunction !== this.props.fetchFunction) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    const { fetchFunction } = this.props;
    
    if (!fetchFunction) {
      console.warn('DataFetcher: fetchFunction prop is required');
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const data = await fetchFunction();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ 
        error: error.message || 'An error occurred while fetching data', 
        loading: false 
      });
    }
  };

  render() {
    const { data, loading, error } = this.state;
    const { children, showDefaultUI = true } = this.props;

    // Render props pattern - pass state and methods to children function
    const renderProps = {
      data,
      loading,
      error,
      refetch: this.fetchData
    };

    // If children is a function, use render props pattern
    if (typeof children === 'function') {
      return children(renderProps);
    }

    // Default UI for common states
    if (showDefaultUI) {
      if (loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        );
      }

      if (error) {
        return (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        );
      }
    }

    // Render children normally if not using render props
    return children;
  }
}

export default DataFetcher; 