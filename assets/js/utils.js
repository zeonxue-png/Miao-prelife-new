const Utils = {
    getFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const personality = [];
        const habits = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.name === 'personality') {
                personality.push(checkbox.value);
            } else if (checkbox.name === 'habits') {
                habits.push(checkbox.value);
            }
        });
        
        data.personality = personality;
        data.habits = habits;
        
        return data;
    },

    validateForm(data) {
        const required = ['catName', 'gender', 'age', 'breed'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            alert(`请填写必填项: ${missing.join(', ')}`);
            return false;
        }
        
        return true;
    },

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    getFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    clearStorage(key) {
        localStorage.removeItem(key);
    },

    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    },

    updateLoadingText(text) {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = text;
        }
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    isValidImageType(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return validTypes.includes(file.type);
    },

    isValidImageSize(file, maxSizeMB = 5) {
        return file.size <= maxSizeMB * 1024 * 1024;
    },

    compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    },

    generateShareText(pastLife) {
        return `我的猫咪 ${pastLife.catName} 的前世竟然是 ${pastLife.name}！${pastLife.era}时期的${pastLife.occupation}，太神奇了！快来测测你的猫咪吧~ #喵星人前世探秘器`;
    },

    downloadImage(canvas, filename = 'cat-past-life.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL();
        link.click();
    }
};
