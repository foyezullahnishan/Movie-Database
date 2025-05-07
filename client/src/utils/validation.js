// Movie validation
export const validateMovie = (movie) => {
  const errors = {};

  // Title validation
  if (!movie.title) {
    errors.title = 'Title is required';
  } else if (movie.title.length < 2) {
    errors.title = 'Title must be at least 2 characters';
  } else if (movie.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  // Release year validation
  if (!movie.releaseYear) {
    errors.releaseYear = 'Release year is required';
  } else {
    const year = parseInt(movie.releaseYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year)) {
      errors.releaseYear = 'Release year must be a number';
    } else if (year < 1900) {
      errors.releaseYear = 'Release year cannot be earlier than 1900';
    } else if (year > currentYear + 5) {
      errors.releaseYear = `Release year cannot be later than ${currentYear + 5}`;
    }
  }

  // Runtime validation
  if (!movie.runtime) {
    errors.runtime = 'Runtime is required';
  } else {
    const runtime = parseInt(movie.runtime);
    if (isNaN(runtime)) {
      errors.runtime = 'Runtime must be a number';
    } else if (runtime < 1) {
      errors.runtime = 'Runtime must be positive';
    } else if (runtime > 600) {
      errors.runtime = 'Runtime cannot exceed 600 minutes (10 hours)';
    }
  }

  // Plot validation
  if (!movie.plot) {
    errors.plot = 'Plot is required';
  } else if (movie.plot.length < 10) {
    errors.plot = 'Plot must be at least 10 characters';
  }

  // Director validation
  if (!movie.director) {
    errors.director = 'Director is required';
  }

  // Poster URL validation (optional field)
  if (movie.poster && !isValidUrl(movie.poster)) {
    errors.poster = 'Poster must be a valid URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Authentication validation
export const validateRegister = (data) => {
  const errors = {};

  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (data.username.length > 30) {
    errors.username = 'Username cannot exceed 30 characters';
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email is not valid';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLogin = (data) => {
  const errors = {};

  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email is not valid';
  }

  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
} 