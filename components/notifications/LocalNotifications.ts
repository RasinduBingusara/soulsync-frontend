import * as Notifications from "expo-notifications";

export const sendNotification = () => {
    console.log('notification send')
    Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Test Notification!",
        body: "This is a test.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  };