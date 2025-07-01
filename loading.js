// Loading Manager
export class LoadingManager {
    constructor() {
        this.overlay = this.createOverlay();
        this.spinner = this.createSpinner();
        this.overlay.appendChild(this.spinner);
        document.body.appendChild(this.overlay);
    }

    // Create loading overlay
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center hidden';
        overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.webkitBackdropFilter = 'blur(4px)';
        return overlay;
    }

    // Create spinner
    createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        return spinner;
    }

    // Show loading
    show() {
        this.overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Hide loading
    hide() {
        this.overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Show loading with a message
    showWithMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'text-white text-lg font-medium mt-4';
        messageElement.textContent = message;
        
        this.overlay.appendChild(messageElement);
        this.show();
        
        return () => {
            messageElement.remove();
            this.hide();
        };
    }

    // Show loading with progress
    showWithProgress(initialProgress = 0) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'w-64 bg-gray-700 rounded-full h-2 mt-4';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300';
        progressBar.style.width = `${initialProgress}%`;
        
        progressContainer.appendChild(progressBar);
        this.overlay.appendChild(progressContainer);
        this.show();
        
        return {
            updateProgress: (progress) => {
                progressBar.style.width = `${progress}%`;
            },
            complete: () => {
                progressContainer.remove();
                this.hide();
            }
        };
    }
}

// Create and export loading manager instance
const loading = new LoadingManager();
export default loading; 