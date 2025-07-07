document.addEventListener('DOMContentLoaded', function() {
    const designWorksContainer = document.querySelector('.design-works-container');
    const horizontalText = document.querySelector('.design-works-horizontal');
    const verticalText = document.querySelector('.design-works-vertical');
    
    if (!designWorksContainer || !horizontalText || !verticalText) {
        return;
    }
    
    // 滚动监听器
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (scrollY >= 100) {
            // 阶段1：显示横排文字（保持居中）
            designWorksContainer.classList.add('slide-up');
            
            if (scrollY >= 350 && scrollY <= 550) {
                // 阶段2：350-550px之间的过渡期
                const progress = (scrollY - 350) / 200; // 0到1之间的进度
                
                // 使用缓动函数让动画更平滑
                const easeInOut = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // 横排文字：逐渐缩小并透明度减小
                const horizontalOpacity = 1 - easeInOut;
                const horizontalScale = 1 - (easeInOut * 0.7); // 从1缩小到0.3
                
                horizontalText.style.opacity = horizontalOpacity;
                horizontalText.style.transform = `scale(${horizontalScale})`;
                
                // 竖排文字：逐渐显示
                if (easeInOut > 0.3) {
                    verticalText.classList.add('fade-in');
                } else {
                    verticalText.classList.remove('fade-in');
                }
                
                const verticalOpacity = easeInOut;
                verticalText.style.opacity = verticalOpacity;
                
            } else if (scrollY > 550) {
                // 阶段3：完全显示竖排文字
                horizontalText.style.opacity = '0';
                horizontalText.style.transform = 'scale(0.3)';
                
                verticalText.classList.add('fade-in');
                verticalText.style.opacity = '1';
                
            } else {
                // 阶段1：只显示横排文字
                horizontalText.style.opacity = '1';
                horizontalText.style.transform = 'scale(1)';
                
                verticalText.classList.remove('fade-in');
                verticalText.style.opacity = '0';
            }
        } else {
            // 完全隐藏
            designWorksContainer.classList.remove('slide-up');
            
            horizontalText.style.opacity = '1';
            horizontalText.style.transform = 'scale(1)';
            
            verticalText.classList.remove('fade-in');
            verticalText.style.opacity = '0';
        }
    });
});