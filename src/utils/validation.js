import { isValidPhoneNumber } from "react-phone-number-input";

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

function returnPasswordError(password) {
  // Regular expressions to match the password
  const regexLength = /^.{8,}$/;
  const regexUpperCase = /[A-Z]/;
  const regexLowerCase = /[a-z]/;
  const regexNumber = /[0-9]/;
  const regexSpecialChar = /[\W]/;
  const regexSpace = /\s/;

  // Check if the password matches the regular expressions
  if (!regexLength.test(password)) {
    return "Password must be at least 8 characters long.";
  } else if (!regexUpperCase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  } else if (!regexLowerCase.test(password)) {
    return "Password must contain at least one lowercase letter.";
  } else if (!regexNumber.test(password)) {
    return "Password must contain at least one number.";
  } else if (!regexSpecialChar.test(password)) {
    return "Password must contain at least one special character.";
  } else if (regexSpace.test(password)) {
    return "Password must not contain spaces.";
  } else {
    return null;
  }
}

function isNaturalNumber(value) {
  return Number.isInteger(+value) && value > 0;
}

export function isWholeNumber(value) {
  return Number.isInteger(+value);
}

const isMaxCharCrossed = (value, count) => {
  if (value.length > count) {
    return true;
  }
  return false;
};

const isMaxIntCrossed = (value, count) => {
  if (value.length > count) {
    return true;
  }
  return false;
};

const minAge = (value) => {
  if (value < 18) {
    return true;
  }
  return false;
};

export const validateEmailOnBlur = (_, value) => {
  if (!value) {
    return Promise.reject("Please input email.");
  }
  if (!validateEmail(value.trim())) {
    return Promise.reject("Please enter valid email address.");
  }
  return Promise.resolve();
};

export const validatePassword = (_, value) => {
  const error = returnPasswordError(value);

  if (error) {
    return Promise.reject(error);
  }
  if (isMaxIntCrossed(value, 19)) {
    return Promise.reject("Password should not be more than 20 characters.");
  }

  return Promise.resolve();
};
