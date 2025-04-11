const formatDate = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

// Truncate text to a specified length and add ellipsis if necessary
const truncateText = (text, length) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get the current year
const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Register the helper functions with hbs
const registerHelpers = (hbs) => {
  if (!hbs) {
    console.error('Invalid hbs instance provided to registerHelpers');
    return;
  }
  
  // Register the helper functions
  hbs.registerHelper('formatDate', formatDate);
  hbs.registerHelper('truncateText', truncateText);
  hbs.registerHelper('getCurrentYear', getCurrentYear);
};

module.exports = {
  registerHelpers,
  formatDate,
  truncateText,
  getCurrentYear
};