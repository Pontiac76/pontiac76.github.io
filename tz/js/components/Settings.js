// Settings Component
function Settings(props) {
  // Filter cities based on search term
  var filteredCities = props.cities.filter(function(city) {
    return (
      city.name.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
      city.timezone.toLowerCase().includes(props.searchTerm.toLowerCase())
    );
  });
  
  return React.createElement(
    'div',
    { className: 'panel' },
    React.createElement('h2', null, 'Settings'),
    
    // Display options
    React.createElement(
      'div',
      { className: 'settings-options' },
      React.createElement(
        'div',
        { className: 'option-toggle' },
        React.createElement(
          'label',
          { className: 'toggle-switch' },
          React.createElement('input', {
            type: 'checkbox',
            checked: props.useFullWidth,
            onChange: function() {
              props.setUseFullWidth(!props.useFullWidth);
            }
          }),
          React.createElement('span', { className: 'toggle-slider' })
        ),
        React.createElement('span', null, 'Use full width cells')
      )
    ),
    
    // City selection section
    React.createElement('h3', null, 'Customize Displayed Cities'),
    
    // Search filter
    React.createElement('input', {
      type: 'text',
      className: 'checkbox-search',
      placeholder: 'Search cities...',
      value: props.searchTerm,
      onChange: function(e) {
        props.setSearchTerm(e.target.value);
      }
    }),
    
    // City grid
    React.createElement(
      'div',
      { className: 'city-checkbox-grid' },
      filteredCities.map(function(city) {
        return React.createElement(
          'div',
          {
            key: city.name,
            className: 'city-checkbox-item ' + (props.selectedCities.includes(city.name) ? 'selected' : ''),
            onClick: function() {
              props.toggleCitySelection(city.name);
            }
          },
          React.createElement('input', {
            type: 'checkbox',
            className: 'city-checkbox',
            checked: props.selectedCities.includes(city.name),
            onChange: function() {} // Handled by the div click
          }),
          React.createElement(
            'div',
            { className: 'city-checkbox-label' },
            React.createElement('span', { className: 'city-checkbox-name' }, city.name),
            React.createElement('span', { className: 'city-checkbox-timezone' }, city.timezone)
          )
        );
      })
    ),
    
    // Add custom timezone section
    React.createElement('h3', null, 'Add Custom Timezone'),
    React.createElement(
      'div',
      { className: 'custom-tz-form' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'City Name',
        value: props.newCityName,
        onChange: function(e) {
          props.setNewCityName(e.target.value);
        }
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Timezone (e.g. America/Chicago)',
        value: props.newCityTimezone,
        onChange: function(e) {
          props.setNewCityTimezone(e.target.value);
        }
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Region (optional)',
        value: props.newCityRegion,
        onChange: function(e) {
          props.setNewCityRegion(e.target.value);
        }
      }),
      React.createElement(
        'button',
        { onClick: props.addCustomCity },
        'Add City'
      )
    ),
    
    // Save settings button
    React.createElement(
      'button',
      {
        className: 'save-settings-btn',
        onClick: props.saveSettings,
        disabled: !props.storageAvailable
      },
      'Save Settings to Browser'
    ),
    
    // Storage availability message
    !props.storageAvailable &&
      React.createElement(
        'div',
        { className: 'storage-status' },
        'Note: Local storage is not available in your current environment. Settings can\'t be saved, but the tool will work normally when hosted on GitHub Pages.'
      ),
    
    // Status message
    props.saveStatus &&
      React.createElement(
        'div',
        { className: 'storage-status' },
        props.saveStatus
      )
  );
}