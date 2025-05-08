export const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        return 'Email is invalid';
    }
    return '';
};

export const validatePhone = (phone) => {
    console.log(phone);
    
    if (!phone.trim()) {
        return 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
        return 'Phone number must be 10 digits long';
    }
    return '';
};

export const validatePassword = (Details) => {
    let newErrors = {};
  
    if (!Details.password) {
      newErrors.password = 'Password is required';
    } else if (Details.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters with one uppercase and one number!';
    } else if (Details.password.length > 10) {
      newErrors.password = 'Password cannot be longer than 10 characters';
    } else if (!/[A-Z]/.test(Details.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(Details.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
  
    return newErrors; // Return the errors object
  };
  