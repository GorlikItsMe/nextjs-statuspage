export default function timeSince(dtStart: Date, dtEnd: Date) {
  if (typeof dtStart == "string"){dtStart = new Date(dtStart)}
  if (typeof dtEnd == "string"){dtEnd = new Date(dtEnd)}
  
  var seconds = Math.floor((dtEnd.getTime() - dtStart.getTime()) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = "year";
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = "month";
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = "day";
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }
  if (interval > 1 || interval === 0) {
    intervalType += "s";
  }
  return interval + " " + intervalType;
}
