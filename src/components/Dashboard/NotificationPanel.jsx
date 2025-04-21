import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiX, FiTrash2 } from "react-icons/fi";
import { TranslationContext2 } from "../../context/TranslationContext2";

const NotificationPanel = ({ 
  notifications, 
  isLoading, 
  getNotificationIcon, 
  onDeleteNotification, 
  onClearAllNotifications,
  unreadCount
}) => {
  const [isConfirmDeleteAll, setIsConfirmDeleteAll] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  // Get translations
  const translationContext = useContext(TranslationContext2);
  const { translations } = translationContext || { 
    translations: { 
      notificationPanel: {
        noNotifications: "No notifications",
        clearAll: "Clear all",
        loading: "Loading notifications...",
        unreadNotifications: "Unread notifications",
        allNotifications: "All notifications",
        markAllRead: "Mark all as read",
        justNow: "Just now",
        minutesAgo: "minutes ago",
        hoursAgo: "hours ago",
        daysAgo: "days ago",
        viewAll: "View all notifications",
        notifications: "Notifications",
        new: "new",
        cancel: "Cancel",
        confirm: "Confirm",
        areYouSure: "Are you sure you want to clear all notifications?"
      }
    } 
  };
  
  const { notificationPanel } = translations;

  // Keep local notifications in sync with props
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Handle deleting a single notification with local state update
  const handleDeleteNotification = (id) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
    onDeleteNotification({ id });
  };

  // Handle clearing all notifications with local state update
  const handleClearAll = () => {
    setLocalNotifications([]);
    onClearAllNotifications();
    setIsConfirmDeleteAll(false);
  };

  // Group notifications by date, with latest first
  const groupNotificationsByDate = (notifs) => {
    const groups = {};
    
    // Create a copy and reverse to get newest first
    [...notifs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach(notif => {
        const date = new Date(notif.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateKey;
        
        if (date.toDateString() === today.toDateString()) {
          dateKey = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateKey = 'Yesterday';
        } else {
          dateKey = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        }
        
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        
        groups[dateKey].push(notif);
      });
    
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(localNotifications);

  return (
    <>
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 className="font-semibold text-gray-800">{notificationPanel.notifications}</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
              {unreadCount} {notificationPanel.new}
            </span>
          )}
          
          {localNotifications.length > 0 && (
            <button 
              onClick={() => setIsConfirmDeleteAll(true)}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 border border-red-100 rounded-lg px-2 py-1 hover:bg-red-50 transition-colors"
            >
              <FiTrash2 size={12} />
              {notificationPanel.clearAll}
            </button>
          )}
        </div>
      </div>
      
      {isConfirmDeleteAll && (
        <div className="p-3 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-700 mb-2">{notificationPanel.areYouSure}</p>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsConfirmDeleteAll(false)}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {notificationPanel.cancel}
            </button>
            <button 
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {notificationPanel.confirm}
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          {notificationPanel.loading}
        </div>
      ) : localNotifications.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FiBell size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">{notificationPanel.noNotifications}</p>
        </div>
      ) : (
        <>
          {Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date} className="pb-2">
              <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 sticky top-14 z-10">
                {date}
              </div>
              <AnimatePresence>
                {notifs.map(notification => (
                  <motion.div 
                    key={notification.id}
                    initial={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                    className={`relative px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="flex gap-3 items-start pr-6">
                      <div className="p-2 rounded-full bg-gray-100 flex-shrink-0">
                        {getNotificationIcon(notification.type, notification.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 mb-0.5">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                      aria-label="Delete notification"
                    >
                      <FiX size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
          
          <div className="p-3 border-t border-gray-100 text-center">
            <button 
              onClick={() => console.log('View all notifications')}
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              {notificationPanel.viewAll}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationPanel;
