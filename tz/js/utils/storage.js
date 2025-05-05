// Storage utility functions

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    var test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Load data from localStorage with fallback to default
function loadFromStorage(key, defaultValue) {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }
  
  try {
    var savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : defaultValue;
  } catch (e) {
    console.error('Error loading ' + key + ' from storage:', e);
    return defaultValue;
  }
}

// Save data to localStorage
function saveToStorage(key, value) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Error saving ' + key + ' to storage:', e);
    return false;
  }
}

// Load cities from localStorage or use defaults
function loadCities() {
  return loadFromStorage('timezone-cities', defaultCities);
}

// Load selected cities from localStorage or use defaults
function loadSelectedCities() {
  return loadFromStorage('timezone-selected', defaultSelectedCities);
}

// Load display preferences
function loadFullWidthPreference() {
  return loadFromStorage('timezone-fullwidth', false);
}

// Save all settings to localStorage
function saveAllSettings(cities, selectedCities, useFullWidth) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    saveToStorage('timezone-cities', cities);
    saveToStorage('timezone-selected', selectedCities);
    saveToStorage('timezone-fullwidth', useFullWidth);
    return true;
  } catch (e) {
    console.error("Error saving settings:", e);
    return false;
  }
}