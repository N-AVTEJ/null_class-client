// Notification Types
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Notification Manager
export class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = [];
    }

    // Create notification container
    createContainer() {
        const container = document.createElement('div');
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-4';
        document.body.appendChild(container);
        return container;
    }

    // Show notification
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slide-in`;
        
        const icon = this.getIcon(type);
        const borderColor = this.getBorderColor(type);
        
        notification.innerHTML = `
            <div class="flex items-center p-4 rounded-lg bg-gray-800 border-l-4 ${borderColor} shadow-lg">
                <div class="flex-shrink-0">
                    ${icon}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-white">${message}</p>
                </div>
                <button class="ml-auto flex-shrink-0 text-gray-400 hover:text-white focus:outline-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Add click handler for close button
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => this.remove(notification));

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    }

    // Remove notification
    remove(notification) {
        if (!notification) return;
        
        notification.classList.add('animate-slide-out');
        notification.addEventListener('animationend', () => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n !== notification);
        });
    }

    // Get icon based on type
    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle text-green-500"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-500"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500"></i>',
            info: '<i class="fas fa-info-circle text-blue-500"></i>'
        };
        return icons[type] || icons.info;
    }

    // Get border color based on type
    getBorderColor(type) {
        const colors = {
            success: 'border-green-500',
            error: 'border-red-500',
            warning: 'border-yellow-500',
            info: 'border-blue-500'
        };
        return colors[type] || colors.info;
    }

    // Convenience methods
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Create and export notification manager instance
const notifications = new NotificationManager();
export default notifications; 