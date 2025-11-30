class ImageUploader {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.previewImage = document.getElementById('previewImage');
        this.uploadedFile = null;
        
        this.init();
    }

    init() {
        this.uploadArea.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            this.handleFileSelect(file);
        });
    }

    async handleFileSelect(file) {
        if (!file) return;

        if (!Utils.isValidImageType(file)) {
            alert('请上传有效的图片格式 (JPG, PNG, WEBP)');
            return;
        }

        if (!Utils.isValidImageSize(file)) {
            alert('图片大小不能超过 5MB');
            return;
        }

        try {
            const compressedFile = await Utils.compressImage(file);
            this.uploadedFile = compressedFile;
            this.showPreview(compressedFile);
            this.analyzeImage(compressedFile);
        } catch (error) {
            console.error('图片处理失败:', error);
            alert('图片处理失败，请重试');
        }
    }

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.previewImage.style.display = 'block';
            
            const placeholder = this.uploadArea.querySelector('.upload-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }

    analyzeImage(file) {
        const mockAnalysis = this.generateMockAnalysis();
        Utils.saveToStorage('imageAnalysis', mockAnalysis);
        return mockAnalysis;
    }

    generateMockAnalysis() {
        const features = [
            '毛色丰富，眼神灵动',
            '体型匀称，姿态优雅',
            '表情温和，气质独特',
            '毛发光泽，健康活泼',
            '眼睛明亮，充满智慧',
            '神态安详，性格温顺'
        ];
        
        const randomFeatures = features
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
            .join('，');
            
        return `这是一只${randomFeatures}的猫咪，从外观特征可以看出其独特的个性魅力。`;
    }

    getUploadedFile() {
        return this.uploadedFile;
    }

    reset() {
        this.uploadedFile = null;
        this.previewImage.style.display = 'none';
        this.previewImage.src = '';
        
        const placeholder = this.uploadArea.querySelector('.upload-placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        
        this.imageInput.value = '';
    }
}

let imageUploader;
document.addEventListener('DOMContentLoaded', () => {
    imageUploader = new ImageUploader();
});
