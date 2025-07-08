// Design页面JavaScript，简化版本
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
    
    // 导航栏跟随滚动效果
    function handleHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 40) {
            header.classList.add('sticky-active');
        } else {
            header.classList.remove('sticky-active');
        }
    }
    
    // 添加滚动监听器
    window.addEventListener('scroll', handleHeaderScroll);
    
    // 悬停效果增强
    const hoverContainers = document.querySelectorAll('.hover-container');
    hoverContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 滚动视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 轻微的视差效果
        const containers = document.querySelectorAll('.hover-container');
        containers.forEach((container, index) => {
            container.style.transform = `translateY(${rate * 0.02 * (index + 1)}px)`;
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
});
