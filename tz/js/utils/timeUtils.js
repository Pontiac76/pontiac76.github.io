// Time-related utility functions

// Format a date object into a time string with AM/PM
function formatTimeAmPm(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
}

// Format a date object to show date and weekday
function formatDate(date) {
  var options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Convert time between cities
function convertTimeBetweenCities(sourceCity, targetCity, timeStr, ampm) {
  try {
    // Create a new date object based on the current date
    var now = new Date();
    
    // Parse the input time
    var timeParts = timeStr.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    
    // Adjust for AM/PM
    if (ampm === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }
    
    // Set the time to the date
    now.setHours(hours, minutes, 0, 0);
    
    // Get the timezone offset for the source city
    var sourceDate = new Date(now.toLocaleString('en-US', { timeZone: sourceCity.timezone }));
    var targetDate = new Date(now.toLocaleString('en-US', { timeZone: targetCity.timezone }));
    
    // Calculate the difference in time
    var offsetDiff = (sourceDate.getTime() - targetDate.getTime());
    
    // Apply the offset to get the target time
    var targetTime = new Date(now.getTime() - offsetDiff);
    
    // Format and return the converted time
    return formatTimeAmPm(targetTime) + " on " + formatDate(targetTime);
  } catch (e) {
    console.error("Error converting time:", e);
    return "Error converting time";
  }
}

// Get current time for all cities
function getCurrentTimesForCities(cities) {
  var now = new Date();
  
  return cities.map(function(city) {
    try {
      var cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
      return {
        name: city.name,
        timezone: city.timezone,
        region: city.region,
        time: formatTimeAmPm(cityTime),
        date: formatDate(cityTime),
        timestamp: cityTime.getTime()
      };
    } catch (e) {
      console.error('Error with timezone ' + city.timezone + ':', e);
      return {
        name: city.name,
        timezone: city.timezone,
        region: city.region,
        time: "Error",
        date: "Unknown",
        timestamp: 0
      };
    }
  });
}