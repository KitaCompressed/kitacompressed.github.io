document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    const mainContent = document.getElementById('main-content');

    const playPromise = splashVideo.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("play video failed:", error);
            showMainContent();
        });
    }
    
    function showMainContent() {
        splashScreen.style.pointerEvents = 'none'; 

        splashScreen.style.opacity = '0';
        
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
        }, { once: true });

        mainContent.style.display = 'block'; 
        document.body.classList.add('loaded');
    }

    splashVideo.addEventListener('ended', showMainContent);

    splashScreen.addEventListener('click', showMainContent);
});