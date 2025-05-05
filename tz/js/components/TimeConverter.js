// Main Time Converter Component
function TimeConverter() {
  var useState = React.useState;
  var useEffect = React.useEffect;
  
  // Storage availability state
  var storageState = useState(false);
  var storageAvailable = storageState[0];
  var setStorageAvailable = storageState[1];
  
  // Check storage on component mount
  useEffect(function() {
    setStorageAvailable(isLocalStorageAvailable());
  }, []);
  
  // State management
  var citiesState = useState(loadCities());
  var cities = citiesState[0];
  var setCities = citiesState[1];
  
  var currentTimesState = useState([]);
  var currentTimes = currentTimesState[0];
  var setCurrentTimes = currentTimesState[1];
  
  var selectedSourceCityState = useState("New York");
  var selectedSourceCity = selectedSourceCityState[0];
  var setSelectedSourceCity = selectedSourceCityState[1];
  
  var selectedTargetCityState = useState("Berlin");
  var selectedTargetCity = selectedTargetCityState[0];
  var setSelectedTargetCity = selectedTargetCityState[1];
  
  var inputTimeState = useState("10:00");
  var inputTime = inputTimeState[0];
  var setInputTime = inputTimeState[1];
  
  var inputAmPmState = useState("PM");
  var inputAmPm = inputAmPmState[0];
  var setInputAmPm = inputAmPmState[1];
  
  var convertedTimeState = useState("");
  var convertedTime = convertedTimeState[0];
  var setConvertedTime = convertedTimeState[1];
  
  var selectedCitiesState = useState(loadSelectedCities());
  var selectedCities = selectedCitiesState[0];
  var setSelectedCities = selectedCitiesState[1];
  
  var useFullWidthState = useState(loadFullWidthPreference());
  var useFullWidth = useFullWidthState[0];
  var setUseFullWidth = useFullWidthState[1];
  
  var newCityNameState = useState("");
  var newCityName = newCityNameState[0];
  var setNewCityName = newCityNameState[1];
  
  var newCityTimezoneState = useState("");
  var newCityTimezone = newCityTimezoneState[0];
  var setNewCityTimezone = newCityTimezoneState[1];
  
  var newCityRegionState = useState("");
  var newCityRegion = newCityRegionState[0];
  var setNewCityRegion = newCityRegionState[1];
  
  var saveStatusState = useState("");
  var saveStatus = saveStatusState[0];
  var setSaveStatus = saveStatusState[1];
  
  var searchTermState = useState("");
  var searchTerm = searchTermState[0];
  var setSearchTerm = searchTermState[1];
  
  // New state for sorting
  var sortByState = useState("time"); // Default sort is by time
  var sortBy = sortByState[0];
  var setSortBy = sortByState[1];

  // Load sort preference from localStorage
  useEffect(function() {
    if (isLocalStorageAvailable()) {
      var savedSort = localStorage.getItem('timezone-sort');
      if (savedSort) {
        setSortBy(savedSort);
      }
    }
  }, []);

  // Update times every second
  useEffect(function() {
    function updateTimes() {
      var times = getCurrentTimesForCities(cities);
      setCurrentTimes(times);
    }
    
    updateTimes();
    var intervalId = setInterval(updateTimes, 1000);
    
    // Cleanup function
    return function() {
      clearInterval(intervalId);
    };
  }, [cities]);

  // Save settings to localStorage
  function saveSettings() {
    if (!isLocalStorageAvailable()) {
      setSaveStatus("Local storage not available in your current environment.");
      return;
    }
    
    var success = saveAllSettings(cities, selectedCities, useFullWidth);
    
    // Also save the sort preference
    if (success) {
      try {
        localStorage.setItem('timezone-sort', sortBy);
        setSaveStatus('Settings saved successfully! They will be remembered next time you visit.');
      } catch (e) {
        console.error("Error saving sort preference:", e);
        setSaveStatus('Error saving some settings. Please make sure cookies are enabled.');
      }
    } else {
      setSaveStatus('Error saving settings. Please make sure cookies are enabled.');
    }
    
    // Clear status message after 3 seconds
    setTimeout(function() {
      setSaveStatus('');
    }, 3000);
  }

  // Effect to run conversion when inputs change
  useEffect(function() {
    var sourceCity = cities.find(function(city) {
      return city.name === selectedSourceCity;
    });
    
    var targetCity = cities.find(function(city) {
      return city.name === selectedTargetCity;
    });
    
    if (!sourceCity || !targetCity) {
      setConvertedTime("City not found");
      return;
    }
    
    var result = convertTimeBetweenCities(sourceCity, targetCity, inputTime, inputAmPm);
    setConvertedTime(result);
  }, [selectedSourceCity, selectedTargetCity, inputTime, inputAmPm, cities]);

  // Toggle city selection
  function toggleCitySelection(cityName) {
    setSelectedCities(function(prev) {
      if (prev.includes(cityName)) {
        return prev.filter(function(name) {
          return name !== cityName;
        });
      } else {
        return prev.concat([cityName]);
      }
    });
  }
  
  // Add a custom city
  function addCustomCity() {
    if (!newCityName || !newCityTimezone) {
      setSaveStatus('Please enter a name and timezone');
      setTimeout(function() {
        setSaveStatus('');
      }, 3000);
      return;
    }
    
    // Check if timezone is valid
    try {
      // Test if timezone is valid by trying to use it
      new Date().toLocaleString('en-US', { timeZone: newCityTimezone });
      
      // Add the new city
      var newCity = {
        name: newCityName,
        timezone: newCityTimezone,
        region: newCityRegion || 'Custom'
      };
      
      setCities(function(prev) {
        return prev.concat([newCity]);
      });
      
      setSelectedCities(function(prev) {
        return prev.concat([newCityName]);
      });
      
      // Clear the form
      setNewCityName('');
      setNewCityTimezone('');
      setNewCityRegion('');
      setSaveStatus('City added successfully! Click "Save Settings" to make it permanent.');
      
      setTimeout(function() {
        setSaveStatus('');
      }, 3000);
    } catch (e) {
      setSaveStatus('Invalid timezone. Please enter a valid IANA timezone like "America/New_York"');
      setTimeout(function() {
        setSaveStatus('');
      }, 3000);
    }
  }

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement('h1', null, 'World Time Zone Converter'),
    
    // Time conversion calculator
    React.createElement(Calculator, {
      cities: cities,
      selectedSourceCity: selectedSourceCity,
      setSelectedSourceCity: setSelectedSourceCity,
      selectedTargetCity: selectedTargetCity,
      setSelectedTargetCity: setSelectedTargetCity,
      inputTime: inputTime,
      setInputTime: setInputTime,
      inputAmPm: inputAmPm,
      setInputAmPm: setInputAmPm,
      convertedTime: convertedTime
    }),
    
    // Current times display with sorting
    React.createElement(CityDisplay, {
      cities: currentTimes,
      selectedCities: selectedCities,
      useFullWidth: useFullWidth,
      enableSorting: true,
      sortBy: sortBy,
      setSortBy: setSortBy
    }),
    
    // Settings panel
    React.createElement(Settings, {
      cities: cities,
      selectedCities: selectedCities,
      toggleCitySelection: toggleCitySelection,
      useFullWidth: useFullWidth,
      setUseFullWidth: setUseFullWidth,
      saveSettings: saveSettings,
      storageAvailable: storageAvailable,
      saveStatus: saveStatus,
      newCityName: newCityName,
      setNewCityName: setNewCityName,
      newCityTimezone: newCityTimezone,
      setNewCityTimezone: setNewCityTimezone,
      newCityRegion: newCityRegion,
      setNewCityRegion: setNewCityRegion,
      addCustomCity: addCustomCity,
      searchTerm: searchTerm,
      setSearchTerm: setSearchTerm
    }),
    
    // Footer
    React.createElement(
      'footer',
      null,
      React.createElement('p', null, 'This tool automatically handles Daylight Saving Time adjustments for all locations.'),
      React.createElement('p', null, 'Your settings are saved in your browser and will be remembered when you return.'),
      React.createElement('p', null, '© 2025 Time Zone Converter | All times updated in real-time')
    )
  );
}