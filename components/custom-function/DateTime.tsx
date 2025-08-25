export const getDate = (timestamp: string): string => {

  const dateObject = new Date(timestamp);

  const datePart = dateObject.toISOString().split('T')[0];

  return datePart;
}

export const getTime = (timestamp: string): string => {

  const dateObject = new Date(timestamp);

  const localTime = dateObject.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return localTime;
}