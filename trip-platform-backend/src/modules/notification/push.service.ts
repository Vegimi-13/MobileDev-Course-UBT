const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};

const isExpoPushToken = (token: string) => {
  return /^ExponentPushToken\[[A-Za-z0-9]+\]$/.test(token);
};

export const validateExpoPushToken = (token: string) => isExpoPushToken(token);

export const sendExpoPushNotifications = async (messages: PushMessage[]) => {
  if (!messages.length) {
    return;
  }

  try {
    await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });
  } catch {
    // Push should not break core flows like invite/like/join.
  }
};
