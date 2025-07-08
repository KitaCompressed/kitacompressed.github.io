// CP页面专用脚本

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

    // 统计卡片悬停效果增强
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 技能标签随机颜色动画
    const skillTags = document.querySelectorAll('.skill-tag');
    const colors = [
        'rgba(255, 107, 107, 0.2)',
        'rgba(78, 205, 196, 0.2)',
        'rgba(69, 183, 209, 0.2)',
        'rgba(255, 193, 7, 0.2)',
        'rgba(156, 121, 230, 0.2)',
        'rgba(255, 116, 119, 0.2)'
    ];

    skillTags.forEach((tag, index) => {
        // 延迟显示每个标签
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, index * 100);

        tag.addEventListener('mouseenter', function() {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.background = randomColor;
            this.style.borderColor = randomColor.replace('0.2', '0.4');
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });

    // 设置初始状态
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = 'all 0.5s ease';
    });

    // 更新最后更新时间
    const updateTimeElement = document.getElementById('lastUpdate');
    if (updateTimeElement) {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        updateTimeElement.textContent = timeString;
    }

    // 为Codeforces数据添加动画效果
    function animateRating() {
        const ratingElement = document.getElementById('cfRating');
        if (ratingElement && ratingElement.textContent !== 'Loading...') {
            const rating = parseInt(ratingElement.textContent);
            let currentRating = 0;
            const increment = rating / 30; // 30帧动画
            
            const animate = () => {
                if (currentRating < rating) {
                    currentRating += increment;
                    ratingElement.textContent = Math.floor(currentRating);
                    requestAnimationFrame(animate);
                } else {
                    ratingElement.textContent = rating;
                }
            };
            
            ratingElement.textContent = '0';
            setTimeout(animate, 500);
        }
    }

    // 监听Codeforces数据更新
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'cfRating' && mutation.target.textContent !== 'Loading...') {
                animateRating();
                observer.disconnect();
            }
        });
    });

    const cfRatingElement = document.getElementById('cfRating');
    if (cfRatingElement) {
        observer.observe(cfRatingElement, { childList: true, characterData: true, subtree: true });
    }

    // 链接点击跟踪
    const profileLinks = document.querySelectorAll('.profile-link');
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 添加点击动画
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = 'translateX(0)';
            }, 200);
            console.log('Profile link clicked:', this.href);
        });
    });
});
