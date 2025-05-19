// Helper function to calculate nextRun date based on interval
const calculateNextRun = (dateTime, interval) => {
  const date = new Date(dateTime);
  switch (interval) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return undefined;
  }
  return date;
}
module.exports =  calculateNextRun ;