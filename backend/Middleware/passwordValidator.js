
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
    return {
      valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      message: `Password must be at least ${minLength} characters and include uppercase, lowercase, number, and special character`
    };
  };
  
  module.exports = validatePassword;