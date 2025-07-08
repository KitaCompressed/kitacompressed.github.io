document.addEventListener('DOMContentLoaded', function() {
    const designWorksContainer = document.querySelector('.design-works-container');
    const stage1Text = document.querySelector('.design-works-horizontal.stage-1');
    const stage2Text = document.querySelector('.design-works-horizontal.stage-2');
    const verticalText = document.querySelector('.design-works-vertical');
    const portfolioShowcase = document.querySelector('.portfolio-showcase');
    const heroTitle = document.querySelector('.hero-title'); // 添加标题元素
    const cpAwardsSection = document.querySelector('.cp-awards-section'); // CP Awards独立区域
    const cpAwardsVertical = document.querySelector('.cp-awards-vertical'); // CP Awards竖排文字
    
    let scrollAnimationEnabled = false; // 控制滚动动画是否启用
    let titleAnimationEnabled = false; // 单独控制标题动画
    let portfolioAnimationState = 'ready'; // 展板动画状态：'ready', 'animating', 'completed'
    
    // 立即启用标题动画，确保滚动时能即时响应
    titleAnimationEnabled = true;
    
    // 等待进场动画完成后启用其他滚动动画
    setTimeout(() => {
        scrollAnimationEnabled = true;
        if (heroTitle) {
            heroTitle.classList.remove('title-animate'); // 确保移除进场动画类
        }
    }, 1600); // 稍微延后，确保进场动画完全结束
    
    if (!designWorksContainer || !stage1Text || !stage2Text || !verticalText || !portfolioShowcase || !heroTitle || !cpAwardsSection || !cpAwardsVertical) {
        return;
    }
    
    // 滚动监听器
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // 标题动画立即启用，其他动画等待进场完成
        if (titleAnimationEnabled) {
            handleHeroTitleAnimation(scrollY);
        }
        
        // 其他滚动动画需要等待进场完成
        if (scrollAnimationEnabled) {
            if (scrollY >= 100) {
            // 容器上滑
            designWorksContainer.classList.add('slide-up');
            // 同时调整作品展示区域位置
            portfolioShowcase.classList.add('positioned');
            // 同时调整CP Awards区域位置
            cpAwardsSection.classList.add('positioned');
            
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
            // 重置作品展示区域位置
            portfolioShowcase.classList.remove('positioned');
            // 重置CP Awards区域位置
            cpAwardsSection.classList.remove('positioned');
            
            stage1Text.style.opacity = '1';
            stage2Text.style.opacity = '0';
            stage2Text.style.transform = 'scale(1)';
            
            verticalText.classList.remove('fade-in');
            verticalText.style.opacity = '0';
            }
        }
        
        // 作品展示区域滚动动画
        handlePortfolioShowcase(scrollY);
        // CP Awards 动画处理
        handleCPAwardsAnimation(scrollY);
    });
    
    // 处理作品展示区域的动画 - 支持重复触发
    function handlePortfolioShowcase(scrollY) {
        const showcaseItems = document.querySelectorAll('.showcase-item');
        const viewMoreButton = document.querySelector('.view-more-button');
        
        // 定义动画的触发和重置区域
        const triggerPoint = 650; // 调整触发位置，配合展板上移
        const resetPoint = 500;   // 相应调整重置位置
        const animationZone = 50; // 防抖动区域
        
        if (scrollY >= triggerPoint && portfolioAnimationState !== 'completed') {
            // 进入触发区域，开始动画
            if (portfolioAnimationState === 'ready') {
                portfolioAnimationState = 'animating';
                
                // 触发展板动画
                showcaseItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200); // 每个项目延迟200ms显示
                });
                
                // 在展板动画完成后触发按钮动画
                if (viewMoreButton) {
                    setTimeout(() => {
                        viewMoreButton.classList.add('animate');
                        portfolioAnimationState = 'completed';
                    }, 800); // 在最后一个展板显示后延迟一点
                }
            }
        } else if (scrollY < resetPoint && portfolioAnimationState !== 'ready') {
            // 离开展示区域足够远，重置动画状态
            portfolioAnimationState = 'ready';
            
            // 重置所有动画状态
            showcaseItems.forEach(item => {
                item.classList.remove('visible');
            });
            
            if (viewMoreButton) {
                viewMoreButton.classList.remove('animate');
            }
        }
        // 在resetPoint和triggerPoint之间的区域不做任何操作，避免频繁切换
    }
    
    // 处理标题的滚动动画 - 完全绑定到滚动位置，即时响应
    function handleHeroTitleAnimation(scrollY) {
        if (!heroTitle) return;
        
        // 设置动画的触发范围
        const startScroll = 0; // 从页面顶部开始
        const maxScroll = 250; // 结束位置
        
        // 计算透明度，完全线性映射
        let opacity = 1;
        
        if (scrollY <= startScroll) {
            opacity = 1; // 在起始位置：完全不透明
        } else if (scrollY >= maxScroll) {
            opacity = 0; // 在最大滚动位置：完全透明
        } else {
            // 线性插值，直接映射到滚动位置
            const progress = (scrollY - startScroll) / (maxScroll - startScroll);
            opacity = Math.max(0, 1 - progress); // 确保不会小于0
        }
        
        // 直接设置透明度，强制覆盖任何CSS过渡
        heroTitle.style.setProperty('opacity', opacity.toString(), 'important');
        heroTitle.style.setProperty('transition', 'none', 'important');
    }
    
    // 处理CP Awards区域的动画
    function handleCPAwardsAnimation(scrollY) {
        // 当展板动画完成后，触发CP Awards淡入动画
        const triggerPoint = 900; // 在展板动画之后触发
        const resetPoint = 750;   // 重置点
        
        const cpAwardItems = document.querySelectorAll('.cp-award-item');
        const cpViewMoreButton = document.querySelector('.cp-view-more-button');
        
        if (scrollY >= triggerPoint) {
            // 先显示竖排文字
            cpAwardsVertical.classList.add('fade-in');
            
            // 然后显示展板项目
            cpAwardItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, (index + 1) * 150); // 延迟显示，在竖排文字之后
            });
            
            // 最后显示按钮
            if (cpViewMoreButton) {
                setTimeout(() => {
                    cpViewMoreButton.classList.add('animate');
                }, 600); // 在展板项目显示后
            }
        } else if (scrollY < resetPoint) {
            // 重置所有动画
            cpAwardsVertical.classList.remove('fade-in');
            
            cpAwardItems.forEach(item => {
                item.classList.remove('visible');
            });
            
            if (cpViewMoreButton) {
                cpViewMoreButton.classList.remove('animate');
            }
        }
    }
});