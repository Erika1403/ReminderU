

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