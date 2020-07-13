import { notification } from 'antd';

class NotificationService {
  showSuccessMessage(message: string, title: string) {
    notification.open({
      type: 'success',
      message: title || 'Notification',
      description: message,
    });
  }

  showErrorMessage(message: string, title: string) {
    notification.open({
      type: 'error',
      message: title || 'Error',
      description: message,
    });
  }
}

export const notificationService = new NotificationService();
