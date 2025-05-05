// Main application initialization
(function() {
  // Get the container element
  var container = document.getElementById('root');
  
  // Create a root React element
  var root = ReactDOM.createRoot(container);
  
  // Render the TimeConverter component
  root.render(React.createElement(TimeConverter, null));
})();