// Time Conversion Calculator Component with grouped dropdowns
function Calculator(props) {
  // Group cities by region for the dropdown
  var citiesByRegion = {};
  props.cities.forEach(function(city) {
    if (!citiesByRegion[city.region]) {
      citiesByRegion[city.region] = [];
    }
    citiesByRegion[city.region].push(city);
  });
  
  // Sort regions alphabetically
  var sortedRegions = Object.keys(citiesByRegion).sort();
  
  // Create dropdown group elements
  function createCityOptions() {
    var groups = [];
    
    sortedRegions.forEach(function(region, index) {
      // Create the optgroup for the region
      groups.push(
        React.createElement(
          'optgroup',
          { label: region, key: 'region-' + index },
          // Create options for each city in this region
          citiesByRegion[region].sort(function(a, b) {
            return a.name.localeCompare(b.name);
          }).map(function(city) {
            return React.createElement(
              'option',
              { key: city.name, value: city.name },
              city.name
            );
          })
        )
      );
    });
    
    return groups;
  }

  return React.createElement(
    'div',
    { className: 'panel' },
    React.createElement('h2', null, 'Time Conversion Calculator'),
    
    React.createElement(
      'div',
      { className: 'converter-form' },
      React.createElement(
        'div',
        { className: 'inline-form-group' },
        React.createElement('label', null, 'Source Time:'),
        React.createElement(
          'select',
          {
            value: props.selectedSourceCity,
            onChange: function(e) {
              props.setSelectedSourceCity(e.target.value);
            },
            className: 'city-select'
          },
          createCityOptions()
        ),
        
        React.createElement(
          'input',
          {
            type: 'time',
            value: props.inputTime,
            onChange: function(e) {
              props.setInputTime(e.target.value);
            },
            style: { width: '100px' }
          }
        ),
        
        React.createElement(
          'select',
          {
            value: props.inputAmPm,
            onChange: function(e) {
              props.setInputAmPm(e.target.value);
            },
            style: { width: '80px' }
          },
          React.createElement('option', { value: 'AM' }, 'AM'),
          React.createElement('option', { value: 'PM' }, 'PM')
        )
      ),
      
      React.createElement(
        'div',
        { className: 'inline-form-group' },
        React.createElement('label', null, 'Target Time:'),
        React.createElement(
          'select',
          {
            value: props.selectedTargetCity,
            onChange: function(e) {
              props.setSelectedTargetCity(e.target.value);
            },
            className: 'city-select'
          },
          createCityOptions()
        )
      ),
      
      React.createElement(
        'div',
        { className: 'converter-result' },
        React.createElement('strong', null, 'Converted Time:'),
        ' ',
        props.convertedTime
      )
    )
  );
}