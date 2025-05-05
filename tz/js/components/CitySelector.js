// Enhanced City Selector Component with Search
function CitySelector(props) {
    var useState = React.useState;
    
    var dropdownOpenState = useState(false);
    var isDropdownOpen = dropdownOpenState[0];
    var setDropdownOpen = dropdownOpenState[1];
    
    var searchTermState = useState('');
    var searchTerm = searchTermState[0];
    var setSearchTerm = searchTermState[1];
    
    var selectedCityObj = props.cities.find(function(city) {
      return city.name === props.selectedCity;
    }) || { name: '', region: '' };
    
    // Group cities by region
    var citiesByRegion = {};
    props.cities.forEach(function(city) {
      if (!citiesByRegion[city.region]) {
        citiesByRegion[city.region] = [];
      }
      citiesByRegion[city.region].push(city);
    });
    
    // Get frequently used cities (5 most recent selections)
    var recentCities = [];
    if (typeof localStorage !== 'undefined') {
      try {
        var recentSelections = JSON.parse(localStorage.getItem('timezone-recent-cities') || '[]');
        recentCities = recentSelections.filter(function(cityName) {
          // Make sure the city still exists in our list
          return props.cities.some(function(city) {
            return city.name === cityName;
          });
        }).slice(0, 5); // Take at most 5 recent cities
      } catch (e) {
        console.error('Error loading recent cities:', e);
      }
    }
    
    // Filter cities based on search term
    function getFilteredCities() {
      if (!searchTerm) {
        return citiesByRegion;
      }
      
      var filteredByRegion = {};
      
      Object.keys(citiesByRegion).forEach(function(region) {
        var filteredCities = citiesByRegion[region].filter(function(city) {
          return (
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.timezone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            region.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        
        if (filteredCities.length > 0) {
          filteredByRegion[region] = filteredCities;
        }
      });
      
      return filteredByRegion;
    }
    
    // Update recent cities when a new city is selected
    function updateRecentCities(cityName) {
      if (typeof localStorage !== 'undefined') {
        try {
          var recentSelections = JSON.parse(localStorage.getItem('timezone-recent-cities') || '[]');
          
          // Remove this city if it's already in the list
          var index = recentSelections.indexOf(cityName);
          if (index !== -1) {
            recentSelections.splice(index, 1);
          }
          
          // Add the city to the beginning of the list
          recentSelections.unshift(cityName);
          
          // Keep only the most recent 10 selections
          recentSelections = recentSelections.slice(0, 10);
          
          localStorage.setItem('timezone-recent-cities', JSON.stringify(recentSelections));
        } catch (e) {
          console.error('Error saving recent cities:', e);
        }
      }
    }
    
    // Handle city selection
    function handleSelectCity(cityName) {
      props.onChange(cityName);
      updateRecentCities(cityName);
      setDropdownOpen(false);
      setSearchTerm('');
    }
    
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest('.city-selector')) {
        setDropdownOpen(false);
      }
    }
    
    // Attach click outside listener
    React.useEffect(function() {
      if (isDropdownOpen) {
        document.addEventListener('click', handleClickOutside);
        
        return function() {
          document.removeEventListener('click', handleClickOutside);
        };
      }
    }, [isDropdownOpen]);
    
    var filteredCities = getFilteredCities();
    var hasResults = Object.keys(filteredCities).length > 0;
    
    return React.createElement(
      'div',
      { className: 'city-selector-container' },
      React.createElement(
        'div',
        { 
          className: 'city-selector-selected',
          onClick: function() { setDropdownOpen(!isDropdownOpen); }
        },
        React.createElement('span', null, selectedCityObj.name),
        React.createElement('span', { className: 'city-selector-region' }, selectedCityObj.region),
        React.createElement('span', { className: 'city-selector-arrow' }, isDropdownOpen ? '▲' : '▼')
      ),
      isDropdownOpen && React.createElement(
        'div',
        { className: 'city-selector-dropdown' },
        React.createElement(
          'div',
          { className: 'city-selector-search' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search cities...',
            value: searchTerm,
            onChange: function(e) { setSearchTerm(e.target.value); },
            onClick: function(e) { e.stopPropagation(); }
          })
        ),
        
        // Recent cities section
        recentCities.length > 0 && React.createElement(
          'div',
          { className: 'city-selector-recent' },
          React.createElement('div', { className: 'city-selector-group-title' }, 'Recently Used'),
          recentCities.map(function(cityName) {
            var city = props.cities.find(function(c) { return c.name === cityName; });
            if (!city) return null;
            
            return React.createElement(
              'div',
              { 
                key: cityName,
                className: 'city-selector-option ' + (selectedCityObj.name === cityName ? 'selected' : ''),
                onClick: function() { handleSelectCity(cityName); }
              },
              React.createElement('span', null, city.name),
              React.createElement('span', { className: 'city-selector-region' }, city.region)
            );
          })
        ),
        
        // All cities grouped by region
        hasResults ? Object.keys(filteredCities).sort().map(function(region) {
          return React.createElement(
            'div',
            { key: region, className: 'city-selector-group' },
            React.createElement('div', { className: 'city-selector-group-title' }, region),
            filteredCities[region].sort(function(a, b) {
              return a.name.localeCompare(b.name);
            }).map(function(city) {
              return React.createElement(
                'div',
                { 
                  key: city.name,
                  className: 'city-selector-option ' + (selectedCityObj.name === city.name ? 'selected' : ''),
                  onClick: function() { handleSelectCity(city.name); }
                },
                React.createElement('span', null, city.name),
                React.createElement('span', { className: 'city-timezone' }, city.timezone)
              );
            })
          );
        }) : React.createElement(
          'div',
          { className: 'city-selector-no-results' },
          'No cities found matching "',
          searchTerm,
          '"'
        )
      )
    );
  }