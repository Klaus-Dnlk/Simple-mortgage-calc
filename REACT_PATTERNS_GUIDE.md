# React Patterns for Code Reusability

This guide demonstrates various React patterns implemented in the Simple Mortgage Calculator project to showcase code reusability, maintainability, and performance optimization techniques.

## 🚪 Portals

**What are Portals?**
Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

**Implementation:** `src/components/Portal/index.jsx`

```jsx
import { createPortal } from "react-dom";

const Portal = ({ children, container = document.body }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, container) : null;
};
```

**Use Cases:**

- Modals and dialogs
- Tooltips
- Loading overlays
- Notifications

**Benefits:**

- Renders outside parent DOM hierarchy
- Avoids CSS z-index issues
- Better accessibility
- Cleaner component structure

## 🛡️ Error Boundaries

**What are Error Boundaries?**
Error boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI.

**Implementation:** `src/components/ErrorBoundary/index.jsx`

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Use Cases:**

- Graceful error handling
- User-friendly error messages
- Error logging and monitoring
- Preventing app crashes

## 🎭 Render Props

**What are Render Props?**
Render props is a pattern for sharing code between React components using a prop whose value is a function.

**Implementation:** `src/components/DataFetcher/index.jsx`

```jsx
class DataFetcher extends React.Component {
  state = { data: null, loading: false, error: null };

  async fetchData() {
    this.setState({ loading: true, error: null });
    try {
      const data = await this.props.fetchFunction();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { data, loading, error } = this.state;

    if (typeof this.props.children === "function") {
      return this.props.children({
        data,
        loading,
        error,
        refetch: this.fetchData,
      });
    }

    return this.props.children;
  }
}
```

**Usage:**

```jsx
<DataFetcher fetchFunction={fetchBanks}>
  {({ data, loading, error, refetch }) =>
    loading ? <Spinner /> : <DataDisplay data={data} />
  }
</DataFetcher>
```

**Benefits:**

- Flexible data sharing
- Reusable logic
- Component composition
- Clear separation of concerns

## 🔄 Higher-Order Components (HOCs)

**What are HOCs?**
Higher-Order Components are functions that take a component and return a new component with additional props or behavior.

**Implementation:** `src/components/withAuth/index.jsx`

```jsx
const withAuth = (WrappedComponent, options = {}) => {
  const WithAuthComponent = (props) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      return <UnauthorizedUI />;
    }

    return (
      <WrappedComponent
        {...props}
        isAuthenticated={isAuthenticated}
        logout={() => {
          localStorage.removeItem("isAuthenticated");
          window.location.reload();
        }}
      />
    );
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return WithAuthComponent;
};
```

**Usage:**

```jsx
const ProtectedComponent = withAuth(MyComponent);
```

**Benefits:**

- Reusable authentication logic
- Separation of concerns
- Can be composed with other HOCs
- Consistent behavior across components

## 🎣 Custom Hooks with useEffect

**What are Custom Hooks?**
Custom hooks are JavaScript functions that start with "use" and may call other hooks. They allow you to extract component logic into reusable functions.

**Implementation:** `src/hooks/useFormValidation/index.js`

```jsx
const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({});

  // Validation function using useEffect
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let formIsValid = true;

      Object.keys(validationRules).forEach((fieldName) => {
        const value = values[fieldName];
        const rules = validationRules[fieldName];

        if (touched[fieldName] || value) {
          // Validation logic here
          if (rules.required && (!value || value.trim() === "")) {
            newErrors[fieldName] =
              rules.required === true
                ? "This field is required"
                : rules.required;
            formIsValid = false;
          }
          // ... more validation rules
        }
      });

      setErrors(newErrors);
      setIsValid(formIsValid);
    };

    validateForm();
  }, [values, validationRules, touched]);

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};
```

**Benefits:**

- Reusable validation logic
- Separation of concerns
- Easier testing
- Consistent validation across components

## ⚡ Memoization Techniques

**What is Memoization?**
Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

**Implementation:** `src/components/MemoizedBankCard/index.jsx`

```jsx
const MemoizedBankCard = React.memo(({ bank, onSelect, isSelected }) => {
  // useMemo for expensive calculations
  const calculatedValues = useMemo(() => {
    const { InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm } = bank;

    const monthlyPayment =
      ((MaximumLoan - MinimumDownPayment) *
        (InterestRate / 100 / 12) *
        Math.pow(1 + InterestRate / 100 / 12, LoanTerm * 12)) /
      (Math.pow(1 + InterestRate / 100 / 12, LoanTerm * 12) - 1);

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      downPaymentPercentage: Math.round(downPaymentPercentage),
    };
  }, [
    bank.InterestRate,
    bank.MaximumLoan,
    bank.MinimumDownPayment,
    bank.LoanTerm,
  ]);

  // useCallback for event handlers
  const handleSelect = useCallback(() => {
    onSelect(bank.id);
  }, [onSelect, bank.id]);

  return <Card>{/* Component JSX */}</Card>;
});
```

**Techniques:**

- `React.memo()` - Prevents re-renders when props haven't changed
- `useMemo()` - Memoizes expensive calculations
- `useCallback()` - Memoizes functions to prevent child re-renders

**Benefits:**

- Prevents unnecessary re-renders
- Optimizes expensive calculations
- Improves overall application performance

## 🔗 Refs for Component-to-HTML Communication

**What are Refs?**
Refs provide a way to access DOM nodes or React elements created in the render method.

**Implementation:** `src/components/RefDemo/index.jsx`

```jsx
const RefDemo = () => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTargetRef = useRef(null);

  // Focus management with refs
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  // DOM measurements with refs
  const measureElement = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
  };

  // Scroll to element with refs
  const scrollToTarget = () => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Paper ref={containerRef}>
      <TextField ref={inputRef} />
      <Button onClick={focusInput}>Focus Input</Button>
      <div ref={scrollTargetRef}>Target Element</div>
    </Paper>
  );
};
```

**Use Cases:**

- Focus management
- DOM measurements
- Direct DOM manipulation
- Integration with third-party DOM libraries
- Scroll to specific elements

## 🎯 Demo Page

Visit `/patterns` in the application to see all these patterns in action with interactive examples.

## 📚 Best Practices

1. **Portals**: Use for modals, tooltips, and overlays that need to render outside the parent DOM hierarchy
2. **Error Boundaries**: Place at strategic points in your component tree to catch and handle errors gracefully
3. **Render Props**: Use when you need to share behavior between components with maximum flexibility
4. **HOCs**: Use for cross-cutting concerns like authentication, logging, or data fetching
5. **Custom Hooks**: Extract reusable logic into custom hooks for better code organization
6. **Memoization**: Use React.memo, useMemo, and useCallback to optimize performance
7. **Refs**: Use sparingly and only when direct DOM access is necessary

## 🔧 Getting Started

1. Navigate to the Patterns Demo page: `/patterns`
2. Explore each pattern with interactive examples
3. Check the source code in the respective component files
4. Experiment with the patterns in your own components

## 📖 Additional Resources

- [React Documentation - Portals](https://reactjs.org/docs/portals.html)
- [React Documentation - Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [React Documentation - Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
- [React Documentation - Custom Hooks](https://reactjs.org/docs/hooks-custom.html)
- [React Documentation - useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)
- [React Documentation - useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)
- [React Documentation - Refs](https://reactjs.org/docs/refs-and-the-dom.html)
