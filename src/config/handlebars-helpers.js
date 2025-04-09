/**
 * Handlebars helper functions for formatting and displaying data
 */

/**
 * Format date to a readable string
 * @param {Date} date - The date to format
 * @returns {String} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Truncate text to a specified length and add ellipsis
 * @param {String} text - The text to truncate
 * @param {Number} length - Max length before truncation
 * @returns {String} Truncated text
 */
const truncateText = (text, length) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Get the current year (used in footer)
 * @returns {Number} Current year
 */
const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Register all helpers with Handlebars
 */
const registerHelpers = (handlebars) => {
  if (!handlebars || !handlebars.handlebars) {
    console.error('Invalid handlebars instance provided to registerHelpers');
    return;
  }
  
  // Register the helper functions
  handlebars.handlebars.registerHelper('formatDate', formatDate);
  handlebars.handlebars.registerHelper('truncateText', truncateText);
  handlebars.handlebars.registerHelper('getCurrentYear', getCurrentYear);
};

module.exports = {
  registerHelpers,
  formatDate,
  truncateText,
  getCurrentYear
};