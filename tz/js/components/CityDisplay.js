// City Display Component
function CityDisplay(props) {
  // Define sorting functions
  var sortFunctions = {
    // Sort by time (earliest to latest)
    time: function(a, b) {
      return a.timestamp - b.timestamp;
    },
    // Sort by name (alphabetically)
    name: function(a, b) {
      return a.name.localeCompare(b.name);
    },
    // Sort by region (alphabetically)
    region: function(a, b) {
      return a.region.localeCompare(b.region);
    }
  };

  // Default sort is by time
  var sortFunction = sortFunctions.time;
  
  // If props.sortBy is provided and exists in our sort functions, use it
  if (props.sortBy && sortFunctions[props.sortBy]) {
    sortFunction = sortFunctions[props.sortBy];
  }

  // Filter and sort cities for display
  var displayCities = props.cities
    .filter(function(city) {
      return props.selectedCities.includes(city.name);
    })
    .sort(sortFunction);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: 'city-header' },
      React.createElement('h2', null, 'Current Times'),
      // Add sorting controls if enabled
      props.enableSorting && React.createElement(
        'div',
        { className: 'sort-controls' },
        React.createElement('span', null, 'Sort by: '),
        React.createElement(
          'select',
          { 
            value: props.sortBy || 'time',
            onChange: function(e) {
              if (props.setSortBy) {
                props.setSortBy(e.target.value);
              }
            }
          },
          React.createElement('option', { value: 'time' }, 'Time (earliest first)'),
          React.createElement('option', { value: 'name' }, 'City Name'),
          React.createElement('option', { value: 'region' }, 'Region')
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'cities-container' },
      displayCities.map(function(city) {
        return React.createElement(
          'div',
          {
            key: city.name,
            className: 'city-cell ' + (props.useFullWidth ? 'full-width' : '')
          },
          props.useFullWidth
            ? [
                React.createElement(
                  'div',
                  { className: 'city-info', key: 'info' },
                  React.createElement('div', { className: 'city-name' }, city.name),
                  React.createElement('div', { className: 'region' }, '(' + city.region + ')')
                ),
                React.createElement(
                  'div',
                  { className: 'time-info', key: 'time' },
                  React.createElement('div', { className: 'time' }, city.time),
                  React.createElement('div', { className: 'date' }, city.date)
                )
              ]
            : [
                React.createElement('div', { className: 'city-name', key: 'name' }, city.name),
                React.createElement('hr', { key: 'hr' }),
                React.createElement('div', { className: 'region', key: 'region' }, city.region),
                React.createElement('div', { className: 'time', key: 'time' }, city.time),
                React.createElement('div', { className: 'date', key: 'date' }, city.date)
              ]
        );
      })
    )
  );
}