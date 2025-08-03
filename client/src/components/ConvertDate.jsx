/*
* @param: {String} dateString
* @desc: Converts date string to date
* @format: ISO Date string
* Responsible for converting ISO Date string from mongodb to a more readable date e.g., Jan. 1 2024
*/
const ConvertDate = ({ dateString, time, today, format }) => {
  const convertToWordDate = (inputDate) => {
    if (!inputDate) {
      return 'Invalid date';
    }

    const date = new Date(inputDate);
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let hours;
    let minutes;
    let amPm;
    let timestamp;

    if (time) {
      hours = date.getHours();
      minutes = date.getMinutes();
      amPm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      timestamp = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${amPm}`;
    }

    if (today) {
      const currentDate = new Date();
      if (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      ) {
        return timestamp;
      }
    }

    if (format === 'short') {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      return `${month}/${day}/${year}`;
    }

    return `${month} ${day}, ${year} ${time ? timestamp : ''}`;
  };

  // Check if dateString is empty
  if (!dateString) {
    return null;
  }

  return convertToWordDate(dateString);
};

export default ConvertDate;