import { useState, useEffect, useCallback } from 'react';

// useFormValidation - custom hook for form validation
// Custom hooks allow you to extract component logic into reusable functions
// This hook demonstrates useEffect for form validation with real-time feedback
// 
// Usage:
// const { values, errors, isValid, handleChange, handleSubmit } = useFormValidation(initialValues, validationRules);
// 
// Pros
// - Reusable validation logic
// - Separation of concerns
// - Easier testing
// - Consistent validation across components


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

      // Validate each field based on validation rules
      Object.keys(validationRules).forEach(fieldName => {
        const value = values[fieldName];
        const rules = validationRules[fieldName];
        
        // Only validate if field has been touched or has a value
        if (touched[fieldName] || value) {
          // Required validation
          if (rules.required && (!value || value.trim() === '')) {
            newErrors[fieldName] = rules.required === true ? 'This field is required' : rules.required;
            formIsValid = false;
          }
          
          // Min length validation
          else if (rules.minLength && value && value.length < rules.minLength) {
            newErrors[fieldName] = rules.minLengthMessage || `Minimum ${rules.minLength} characters required`;
            formIsValid = false;
          }
          
          // Max length validation
          else if (rules.maxLength && value && value.length > rules.maxLength) {
            newErrors[fieldName] = rules.maxLengthMessage || `Maximum ${rules.maxLength} characters allowed`;
            formIsValid = false;
          }
          
          // Pattern validation (regex)
          else if (rules.pattern && value && !rules.pattern.test(value)) {
            newErrors[fieldName] = rules.patternMessage || 'Invalid format';
            formIsValid = false;
          }
          
          // Custom validation function
          else if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value, values);
            if (customError) {
              newErrors[fieldName] = customError;
              formIsValid = false;
            }
          }
        }
      });

      setErrors(newErrors);
      setIsValid(formIsValid);
    };

    validateForm();
  }, [values, validationRules, touched]);

  // Handle input changes
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Handle input blur (mark as touched)
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
    setTouched({});
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(validationRules).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      
      // If form is valid, call onSubmit
      if (isValid) {
        onSubmit(values);
      }
    };
  }, [isValid, values, validationRules]);

  return {
    values,
    errors,
    isValid,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useFormValidation; 