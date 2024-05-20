

export function convertToAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours12 = hours12 % 12 || 12;

    // Add leading zeros to minutes if necessary
    const paddedMinutes = minutes.padStart(2, '0');

    return `${hours12}:${paddedMinutes} ${suffix}`;
}

export function convertAmPmToMilitary(timeString) {
    // Check for invalid input format
    if (!/^\d{1,2}:\d{2}(?: AM| PM)$/.test(timeString)) {
      throw new Error('Invalid time format. Please use HH:MM (AM/PM)');
    }
  
    const [hours, minutes, modifier] = timeString.split(':').map(part => parseInt(part, 10));
  
    // Convert to military time based on modifier
    let militaryHours = modifier === 'PM' ? hours + 12 : hours;
  
    // Handle midnight (12:00 AM) as 00:00
    if (militaryHours === 24 && minutes === 0) {
      militaryHours = 0;
    }
  
    // Handle noon (12:00 PM) as 12:00
    if (militaryHours === 12 && minutes === 0 && modifier === 'PM') {
      militaryHours = 12;
    }
  
    // Ensure hours are formatted as two digits
    militaryHours = militaryHours.toString().padStart(2, '0');
  
    return `${militaryHours}:${minutes.toString().padStart(2, '0')}`;
  }
  export function convertTimeToMilitary(timeString) {
    // Regular expression to match time format (leading zero optional)
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9])$/;
  
    // Check if the format matches (including leading zero for hours)
    if (timeRegex.test(timeString)) {
      // Split the time string and convert hours to a number
      const [hoursString, minutesString] = timeString.split(':');
      const hours = parseInt(hoursString, 10);
  
      // Add leading zero for hours if necessary (single digit or zero)
      const formattedHours = hours < 10 ? `0${hours}` : hoursString;
  
      return `${formattedHours}:${minutesString}:00`;
    } else {
      // Invalid format, return original string
      return timeString;
    }
  }