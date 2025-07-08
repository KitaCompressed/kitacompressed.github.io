// Movie页面JavaScript，基于参考设计
document.addEventListener('DOMContentLoaded', function() {
    // 预加载器处理
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    // 页面加载完成后隐藏预加载器
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            mainContent.style.opacity = '1';
            
            // 触发加载动画
            const loadElements = document.querySelectorAll('.load-ani');
            loadElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 500);
    });
    
    // 全屏查看功能
    const fullscreenView = document.querySelector('.fullscreen-view');
    const fullscreenVideo = document.querySelector('.fullscreen-video');
    const closeBtn = document.querySelector('.close');
    
    // 视频链接点击事件（跳转到B站）
    const videoLinks = document.querySelectorAll('.video-link');
    videoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const videoUrl = this.dataset.video;
            if (videoUrl) {
                window.open(videoUrl, '_blank');
            }
        });
    });
    
    // 视频点击事件（本地视频全屏播放）
    const videos = document.querySelectorAll('.small-video, .thumbnail-video');
    videos.forEach(video => {
        video.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 确保这不是一个video-link
            if (!this.closest('.video-link')) {
                const source = this.querySelector('source');
                if (source) {
                    fullscreenVideo.querySelector('source').src = source.src;
                    fullscreenVideo.load(); // 重新加载视频
                    
                    fullscreenView.classList.add('show');
                    document.body.style.overflow = 'hidden';
                    
                    // 自动播放
                    fullscreenVideo.play().catch(e => {
                        console.log('视频自动播放失败:', e);
                    });
                }
            }
        });
    });
    
    // 关闭全屏查看
    function closeFullscreen() {
        fullscreenView.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // 停止视频播放
        fullscreenVideo.pause();
        fullscreenVideo.currentTime = 0;
    }
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', closeFullscreen);
    
    // 点击背景关闭
    fullscreenView.addEventListener('click', function(e) {
        if (e.target === fullscreenView) {
            closeFullscreen();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fullscreenView.classList.contains('show')) {
            closeFullscreen();
        }
    });
    
    // 悬停效果增强
    const hoverContainers = document.querySelectorAll('.hover-container');
    hoverContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            if (!this.classList.contains('video-link')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            } else {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 滚动视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 为大视频添加轻微的视差效果
        const bigVideo = document.querySelector('.big-video');
        if (bigVideo) {
            bigVideo.style.transform = `translateY(${rate * 0.1}px)`;
        }
    });
    
    // 视频悬停播放控制
    const thumbnailVideos = document.querySelectorAll('.thumbnail-video, .small-video');
    thumbnailVideos.forEach(video => {
        video.addEventListener('mouseenter', function() {
            this.play().catch(e => {
                console.log('视频播放失败:', e);
            });
        });
        
        video.addEventListener('mouseleave', function() {
            this.pause();
        });
    });
    
    // 图片懒加载优化
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // 观察所有延迟加载的图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => observer.observe(img));
    
    // 添加播放图标动画
    const playIcons = document.querySelectorAll('.play-icon');
    playIcons.forEach(icon => {
        const parent = icon.parentElement;
        
        parent.addEventListener('mouseenter', function() {
            icon.style.animation = 'pulse 1.5s infinite';
        });
        
        parent.addEventListener('mouseleave', function() {
            icon.style.animation = 'none';
        });
    });
    
    // 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
