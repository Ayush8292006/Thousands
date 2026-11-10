import { Platform, Alert, Share, useWindowDimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const WEB_MAX_WIDTH = 480;

// Web pe app phone-frame (max 480px) mein chalti hai, isliye layout width bhi wahi
export function useAppWidth() {
  const { width, height } = useWindowDimensions();
  return { width: isWeb ? Math.min(width, WEB_MAX_WIDTH) : width, height };
}

export function notify(title, message) {
  if (isWeb) window.alert(message ? `${title}\n\n${message}` : title);
  else Alert.alert(title, message);
}

export function confirmAction(title, message, confirmText, onConfirm) {
  if (isWeb) {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'No', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

export async function shareText(message) {
  try {
    if (isWeb) {
      if (navigator.share) await navigator.share({ text: message });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        window.alert('Copied to clipboard');
      }
      return;
    }
    await Share.share({ message });
  } catch (e) {
    // user ne share cancel kiya — kuch nahi karna
  }
}
