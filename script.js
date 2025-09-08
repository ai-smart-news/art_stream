document.addEventListener('DOMContentLoaded', () => {
    const videoFeed = document.querySelector('.video-feed');

    // 示例影片數據
    const videoData = [
        { id: 1, src: 'videos/video1.mp4', title: '城市霓虹夜', description: '@DancingQueen88 - City lights & dancing nights! #UrbanDance #Shorts' },
        { id: 2, src: 'videos/video2.mp4', title: '山間日出', description: '@NatureLover - Breathtaking sunrise in the mountains. #Travel #Views' },
        { id: 3, src: 'videos/video3.mp4', title: '可愛貓咪日常', description: '@KittyTales - My cat is just too cute! #CatsOfInstagram #PetLife' },
        { id: 4, src: 'videos/video4.mp4', title: '美食製作', description: '@FoodieFanatic - Delicious homemade pasta recipe. #Cooking #FoodPorn' },
        { id: 5, src: 'videos/video5.mp4', title: '星空縮時攝影', description: '@Stargazer - A magical night under the stars. #Astrophotography #Timelapse' },
        { id: 6, src: 'videos/video6.mp4', title: '極限運動', description: '@AdrenalineJunkie - Skateboarding tricks in the park. #ExtremeSports #Skate' },
        { id: 7, src: 'videos/video7.mp4', title: '藝術創作', description: '@ArtisticSoul - Painting a vibrant abstract piece. #Art #Creative' },
        { id: 8, src: 'videos/video8.mp4', title: '海邊放鬆', description: '@BeachVibes - Sunset strolls by the ocean. #Relax #BeachLife' },
        // ... 添加更多影片數據 ...
    ];

    let currentVideoIndex = 0;
    const preloadCount = 3; // 前後預載影片的數量

    // 創建單個影片卡片
    function createVideoCard(videoItem, index) {
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');
        videoCard.dataset.index = index;

        const videoPlayer = document.createElement('video');
        videoPlayer.classList.add('video-player');
        videoPlayer.src = videoItem.src;
        videoPlayer.loop = true;
        videoPlayer.muted = true; // 預設靜音
        videoPlayer.playsInline = true; // 在 iOS 上啟用內聯播放
        videoPlayer.preload = 'auto'; // 預載影片

        const videoOverlay = document.createElement('div');
        videoOverlay.classList.add('video-overlay');

        const videoInfo = document.createElement('div');
        videoInfo.classList.add('video-info');
        const title = document.createElement('h3');
        title.textContent = videoItem.title;
        const description = document.createElement('p');
        description.textContent = videoItem.description;
        videoInfo.appendChild(title);
        videoInfo.appendChild(description);

        const controls = document.createElement('div');
        controls.classList.add('controls');
        const playPauseBtn = document.createElement('button');
        playPauseBtn.classList.add('control-btn', 'play-pause-btn');
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // 預設顯示播放圖標
        const muteUnmuteBtn = document.createElement('button');
        muteUnmuteBtn.classList.add('control-btn', 'mute-unmute-btn');
        muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; // 預設顯示音量圖標
        controls.appendChild(playPauseBtn);
        controls.appendChild(muteUnmuteBtn);

        const sideActions = document.createElement('div');
        sideActions.classList.add('side-actions');
        // Add Like button
        const likeBtn = document.createElement('div');
        likeBtn.classList.add('action-btn');
        likeBtn.innerHTML = '<i class="fas fa-heart"></i><span>1.2M</span>';
        // Add Comment button
        const commentBtn = document.createElement('div');
        commentBtn.classList.add('action-btn');
        commentBtn.innerHTML = '<i class="fas fa-comment-dots"></i><span>5.7K</span>';
        // Add Share button
        const shareBtn = document.createElement('div');
        shareBtn.classList.add('action-btn');
        shareBtn.innerHTML = '<i class="fas fa-share"></i><span>Share</span>';
        sideActions.appendChild(likeBtn);
        sideActions.appendChild(commentBtn);
        sideActions.appendChild(shareBtn);

        const playIndicator = document.createElement('div');
        playIndicator.classList.add('play-indicator');
        playIndicator.innerHTML = '<i class="fas fa-play"></i>';


        videoOverlay.appendChild(videoInfo);
        videoCard.appendChild(videoPlayer);
        videoCard.appendChild(videoOverlay);
        videoCard.appendChild(controls);
        videoCard.appendChild(sideActions);
        videoCard.appendChild(playIndicator);

        // 事件監聽器
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡到 videoPlayer
            togglePlayPause(videoPlayer, playPauseBtn, videoCard, playIndicator);
        });

        muteUnmuteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡到 videoPlayer
            toggleMuteUnmute(videoPlayer, muteUnmuteBtn);
        });

        videoPlayer.addEventListener('click', (e) => {
            togglePlayPause(videoPlayer, playPauseBtn, videoCard, playIndicator);
        });

        // 初始化播放狀態
        videoCard.classList.add('paused');
        videoPlayer.muted = true;
        muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // 預設靜音圖標

        return videoCard;
    }

    // 播放/暫停功能
    function togglePlayPause(video, btn, card, indicator) {
        if (video.paused) {
            video.play();
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            card.classList.remove('paused');
            indicator.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            btn.innerHTML = '<i class="fas fa-play"></i>';
            card.classList.add('paused');
            indicator.innerHTML = '<i class="fas fa-play"></i>';
        }
        indicator.style.opacity = 1;
        clearTimeout(video.indicatorTimeout);
        video.indicatorTimeout = setTimeout(() => {
            indicator.style.opacity = 0;
        }, 500); // 指示器顯示0.5秒
    }

    // 靜音/取消靜音功能
    function toggleMuteUnmute(video, btn) {
        video.muted = !video.muted;
        if (video.muted) {
            btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            btn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // 加載和預載影片
    function renderVideos(startIndex) {
        // 清空現有的影片卡片
        videoFeed.innerHTML = '';
        const frag = document.createDocumentFragment();

        const start = Math.max(0, startIndex - preloadCount);
        const end = Math.min(videoData.length - 1, startIndex + preloadCount);

        for (let i = start; i <= end; i++) {
            const videoCard = createVideoCard(videoData[i], i);
            frag.appendChild(videoCard);
        }
        videoFeed.appendChild(frag);

        // 啟動 Intersection Observer
        initObserver();
    }

    let observer;

    function initObserver() {
        if (observer) {
            observer.disconnect(); // 清除之前的觀察器
        }

        const options = {
            root: videoFeed,
            rootMargin: '0px',
            threshold: 0.75 // 當影片卡片有75%進入視圖時觸發
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const videoCard = entry.target;
                const video = videoCard.querySelector('.video-player');
                const index = parseInt(videoCard.dataset.index);

                if (entry.isIntersecting) {
                    // 當影片進入視圖
                    if (index === currentVideoIndex) {
                        // 這是當前播放的影片
                        if (video.paused) {
                            video.play().catch(e => console.error("Play error:", e));
                            videoCard.classList.remove('paused');
                            videoCard.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
                        }
                    } else {
                        // 預載入或暫停非當前影片
                        video.pause();
                        videoCard.classList.add('paused');
                        videoCard.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
                    }

                    // 如果滾動到了新的當前影片
                    if (index !== currentVideoIndex) {
                        currentVideoIndex = index;
                        // 重新渲染以確保預載緩衝區正確
                        renderVideos(currentVideoIndex);
                        // 滾動到正確的位置
                        const currentCard = videoFeed.querySelector(`[data-index="${currentVideoIndex}"]`);
                        if (currentCard) {
                             videoFeed.scrollTo({
                                top: currentCard.offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }

                } else {
                    // 當影片離開視圖
                    video.pause();
                    videoCard.classList.add('paused');
                    videoCard.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }, options);

        // 觀察所有影片卡片
        videoFeed.querySelectorAll('.video-card').forEach(card => {
            observer.observe(card);
        });
    }

    // 初始化渲染和觀察器
    renderVideos(currentVideoIndex);

    // 確保第一個影片立即播放（如果允許）
    const initialVideo = videoFeed.querySelector(`[data-index="${currentVideoIndex}"] .video-player`);
    if (initialVideo) {
        initialVideo.play().catch(e => console.log("Initial play blocked, video muted.", e));
        initialVideo.parentNode.classList.remove('paused');
        initialVideo.parentNode.querySelector('.play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
    }

    // 處理鍵盤事件 (方便桌面端測試)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            const currentVideoCard = videoFeed.querySelector(`[data-index="${currentVideoIndex}"]`);
            const video = currentVideoCard.querySelector('.video-player');
            const playPauseBtn = currentVideoCard.querySelector('.play-pause-btn');
            const playIndicator = currentVideoCard.querySelector('.play-indicator');
            togglePlayPause(video, playPauseBtn, currentVideoCard, playIndicator);
        } else if (e.code === 'ArrowDown' || e.code === 'PageDown') {
            e.preventDefault();
            const nextIndex = (currentVideoIndex + 1) % videoData.length;
            const nextCard = videoFeed.querySelector(`[data-index="${nextIndex}"]`);
            if (nextCard) {
                videoFeed.scrollTo({
                    top: nextCard.offsetTop,
                    behavior: 'smooth'
                });
            }
        } else if (e.code === 'ArrowUp' || e.code === 'PageUp') {
            e.preventDefault();
            const prevIndex = (currentVideoIndex - 1 + videoData.length) % videoData.length;
            const prevCard = videoFeed.querySelector(`[data-index="${prevIndex}"]`);
            if (prevCard) {
                videoFeed.scrollTo({
                    top: prevCard.offsetTop,
                    behavior: 'smooth'
                });
            }
        } else if (e.code === 'KeyM') {
            const currentVideoCard = videoFeed.querySelector(`[data-index="${currentVideoIndex}"]`);
            const video = currentVideoCard.querySelector('.video-player');
            const muteUnmuteBtn = currentVideoCard.querySelector('.mute-unmute-btn');
            toggleMuteUnmute(video, muteUnmuteBtn);
        }
    });

});
