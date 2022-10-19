const emailRegex =
  /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/

export const validateRegisterInput = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {}

  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else if (!email.match(emailRegex)) {
    errors.email = 'Email must be a valid email address'
  }

  if (password === '') {
    errors.password = 'Password must not be empty'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

export const validateLoginInput = ({ email, password }) => {
  const errors = {}

  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else if (!email.match(emailRegex)) {
    errors.email = 'Email must be a valid email address'
  }
  if (password === '') {
    errors.password = 'Password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

export const validateEmail = (email) => {
  const errors = {}
  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else if (!email.match(emailRegex)) {
    errors.email = 'Email must be a valid email address'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
