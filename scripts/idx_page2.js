document.addEventListener('DOMContentLoaded', function() {
    const designWorksContainer = document.querySelector('.design-works-container');
    const stage1Text = document.querySelector('.design-works-horizontal.stage-1');
    const stage2Text = document.querySelector('.design-works-horizontal.stage-2');
    const verticalText = document.querySelector('.design-works-vertical');
    
    if (!designWorksContainer || !stage1Text || !stage2Text || !verticalText) {
        return;
    }
    
    // 滚动监听器
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (scrollY >= 100) {
            // 容器上滑
            designWorksContainer.classList.add('slide-up');
            
            if (scrollY >= 200 && scrollY <= 350) {
                // 阶段1到阶段2的过渡：Design Works 淡出，CP Awards 淡入
                const progress = (scrollY - 200) / 150; // 0到1之间的进度
                
                // 使用缓动函数让动画更平滑
                const easeInOut = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // Stage 1 (#1 Design Works) 淡出
                const stage1Opacity = 1 - easeInOut;
                stage1Text.style.opacity = stage1Opacity;
                
                // Stage 2 (#2 CP Awards) 淡入
                const stage2Opacity = easeInOut;
                stage2Text.style.opacity = stage2Opacity;
                
                // 竖排文字保持隐藏
                verticalText.classList.remove('fade-in');
                verticalText.style.opacity = '0';
                
            } else if (scrollY >= 450 && scrollY <= 650) {
                // 阶段2到竖排的过渡：CP Awards 缩小淡出，竖排文字淡入
                const progress = (scrollY - 450) / 200; // 0到1之间的进度
                
                const easeInOut = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                // Stage 1 完全隐藏
                stage1Text.style.opacity = '0';
                
                // Stage 2 缩小并淡出
                const stage2Opacity = 1 - easeInOut;
                const stage2Scale = 1 - (easeInOut * 0.7); // 从1缩小到0.3
                stage2Text.style.opacity = stage2Opacity;
                stage2Text.style.transform = `scale(${stage2Scale})`;
                
                // 竖排文字淡入
                if (easeInOut > 0.3) {
                    verticalText.classList.add('fade-in');
                } else {
                    verticalText.classList.remove('fade-in');
                }
                
                const verticalOpacity = easeInOut;
                verticalText.style.opacity = verticalOpacity;
                
            } else if (scrollY > 650) {
                // 阶段3：完全显示竖排文字
                stage1Text.style.opacity = '0';
                stage2Text.style.opacity = '0';
                stage2Text.style.transform = 'scale(0.3)';
                
                verticalText.classList.add('fade-in');
                verticalText.style.opacity = '1';
                
            } else if (scrollY >= 350 && scrollY < 450) {
                // 阶段2：只显示 #2 CP Awards
                stage1Text.style.opacity = '0';
                stage2Text.style.opacity = '1';
                stage2Text.style.transform = 'scale(1)';
                
                verticalText.classList.remove('fade-in');
                verticalText.style.opacity = '0';
                
            } else {
                // 阶段1：只显示 #1 Design Works
                stage1Text.style.opacity = '1';
                stage2Text.style.opacity = '0';
                stage2Text.style.transform = 'scale(1)';
                
                verticalText.classList.remove('fade-in');
                verticalText.style.opacity = '0';
            }
        } else {
            // 完全隐藏
            designWorksContainer.classList.remove('slide-up');
            
            stage1Text.style.opacity = '1';
            stage2Text.style.opacity = '0';
            stage2Text.style.transform = 'scale(1)';
            
            verticalText.classList.remove('fade-in');
            verticalText.style.opacity = '0';
        }
    });
});