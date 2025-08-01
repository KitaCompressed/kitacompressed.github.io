window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');
});

document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');

    const title = document.querySelector('.hero-title');
    if (title) {
        title.classList.add('title-animate');
        // 动画完成后移除no-scroll和title-animate类
        setTimeout(() => {
            document.body.classList.remove('no-scroll');
            title.classList.remove('title-animate'); // 移除进场动画类，允许滚动动画生效
        }, 1500); // 与CSS动画时长匹配 (1.2s + 0.3s缓冲)
    } else {
        // 没有 hero-title，直接允许滚动
        document.body.classList.remove('no-scroll');
    }
    
    // 页面加载时检查footer是否应该显示
    checkFooterVisibility();
});

function checkFooterVisibility() {
    const footer = document.querySelector('.site-footer');
    if (footer) {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 如果页面高度不足，直接显示footer
        if (documentHeight <= windowHeight * 1.2) {
            if (!footer.classList.contains('footer-visible')) {
                setTimeout(() => {
                    footer.classList.add('footer-visible');
                }, 500); // 延迟500ms显示，给页面一个加载的感觉
            }
        } else {
            // 当滚动到接近底部时触发footer动画
            const triggerPoint = documentHeight - windowHeight - 200; // 距离底部200px时触发
            
            if (scrollTop >= triggerPoint) {
                footer.classList.add('footer-visible');
            }
        }
    }
}

// 动态调整页面高度，消除footer底下的多余空白
function adjustPageHeight() {
    const portfolioShowcase = document.querySelector('.portfolio-showcase');
    const footer = document.querySelector('.site-footer');
    
    if (portfolioShowcase && footer) {
        // 计算展板区域的实际底部位置
        const showcaseRect = portfolioShowcase.getBoundingClientRect();
        const showcaseBottom = showcaseRect.bottom + window.scrollY;
        
        // 获取footer的高度
        const footerHeight = footer.offsetHeight;
        
        // 设置body的高度为展板底部 + footer高度，消除多余空白
        const targetHeight = showcaseBottom + footerHeight;
        document.body.style.minHeight = targetHeight + 'px';
    }
}

// 处理标题滚动动画
function handleTitleScrollAnimation() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    // 只在首页执行标题滚动动画
    if (document.body.classList.contains('index-page')) {
        const scrollY = window.scrollY;
        
        if (scrollY >= 50) {
            // 开始滚动动画的触发点
            const progress = Math.min(scrollY / 300, 1); // 0到1之间的进度，300px为完全动画距离
            
            // 使用缓动函数让动画更平滑（参考Design Works）
            const easeOut = 1 - Math.pow(1 - progress, 2);
            
            // 计算缩放和透明度
            const scale = 1 - (easeOut * 0.7); // 从1缩小到0.3
            const opacity = 1 - (easeOut * 0.7); // 从1减少到0.3
            
            // 直接设置样式属性（就像Design Works一样）
            title.style.transform = `scale(${scale})`;
            title.style.opacity = opacity;
            
        } else {
            // 恢复原始状态
            title.style.transform = 'scale(1)';
            title.style.opacity = '1';
        }
    }
}

// 统一的滚动事件处理
function handleScroll() {
    const header = document.querySelector('.main-header');

    // 导航栏跟随滚动效果 - 在所有页面都生效
    if (header) {
        if (window.scrollY > 40) {
            header.classList.add('sticky-active');
        } else {
            header.classList.remove('sticky-active');
        }
    }

    // 执行标题滚动动画（仅首页）
    handleTitleScrollAnimation();
    
    // Footer动画效果
    checkFooterVisibility();
}

// 只添加一次滚动监听器
window.addEventListener('scroll', handleScroll);

// 在展板动画完成后调整页面高度
window.addEventListener('load', function() {
    // ...existing code...
    
    // 延迟调整页面高度，确保所有元素都已渲染
    setTimeout(adjustPageHeight, 2000);
});

// 在窗口大小改变时重新调整
window.addEventListener('resize', function() {
    setTimeout(adjustPageHeight, 100);
});