import React from 'react';
import styles from './NotificationAlert.module.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationAlertProps {
  type: NotificationType;
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export const NotificationAlert: React.FC<NotificationAlertProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  return (
    <div className={`${styles.notificationAlert} ${styles[type]} ${className}`}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.message}>{message}</div>
    </div>
  );
};