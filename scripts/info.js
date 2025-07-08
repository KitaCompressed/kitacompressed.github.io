// Info页面专用脚本

document.addEventListener('DOMContentLoaded', function() {
    // 预加载器处理
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // 触发加载动画
    const loadElements = document.querySelectorAll('.load-ani');
    loadElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animationPlayState = 'running';
        }, index * 200);
    });

    // 工具图标悬停效果
    const iconItems = document.querySelectorAll('.icon-item');
    iconItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // 社交链接点击跟踪（可选）
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 这里可以添加分析跟踪代码
            console.log('Social link clicked:', this.href);
        });
    });
});
