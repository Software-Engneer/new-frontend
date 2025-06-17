const colors = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
  '#d35400', '#c0392b', '#7f8c8d', '#00bcd4', '#009688'
];

export const getProfileColor = (username) => {
  if (!username) return colors[0];
  
  // Get the first character and convert to uppercase
  const initial = username.charAt(0).toUpperCase();
  
  // Calculate index based on character code
  const charCode = initial.charCodeAt(0);
  const index = (charCode - 65) % colors.length;
  
  // Return color, defaulting to first color if calculation fails
  return colors[index] || colors[0];
}; 