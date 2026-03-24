(function() {
  'use strict';

  if (window.__ArellanoYTInit) return;
  window.__ArellanoYTInit = true;

  const injectCSS = () => {
    const css = `
      ytd-ad-slot-renderer,
      ytd-in-feed-ad-layout-renderer,
      ytd-display-ad-renderer,
      ytd-promoted-sparkles-web-renderer,
      ytd-promoted-video-renderer,
      ytd-banner-promo-renderer,
      ytd-ad-overlay-renderer,
      ytd-ad-background-renderer,
      ytd-ad-module-renderer,
      ytd-companion-slot-renderer,
      ytd-merch-shelf-renderer,
      ytd-watch-next-secondary-results-renderer ytd-ad-slot-renderer,
      #secondary ytd-ad-slot-renderer,
      #secondary-inner ytd-ad-slot-renderer,
      .ytp-ad-module,
      .ytp-ad-overlay-container,
      .ytp-ad-overlay-slot,
      .ytp-ad-text-overlay,
      .ytp-ad-skip-button-container,
      .ytp-ad-player-overlay-instream-info,
      .video-ads #player-ads,
      #player-ads.ytd-mealbar-promo-renderer,
      ytd-mealbar-promo-renderer {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      
      .ytp-ad-overlay-close-button {
        display: none !important;
      }
    `;

    const style = document.createElement('style');
    style.id = 'arellano-yt-css';
    style.textContent = css;
    
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('head', () => document.head.appendChild(style), { once: true });
    }
  };

  const hideAdElements = () => {
    const selectors = [
      'ytd-ad-slot-renderer',
      'ytd-in-feed-ad-layout-renderer',
      'ytd-display-ad-renderer',
      'ytd-promoted-sparkles-web-renderer',
      'ytd-promoted-video-renderer',
      'ytd-banner-promo-renderer',
      'ytd-ad-overlay-renderer',
      'ytd-ad-background-renderer',
      'ytd-ad-module-renderer',
      'ytd-companion-slot-renderer',
      'ytd-merch-shelf-renderer',
      'ytd-mealbar-promo-renderer',
      '.ytp-ad-module',
      '.ytp-ad-overlay-container',
      '.ytp-ad-overlay-slot',
      '.ytp-ad-text-overlay',
      '.ytp-ad-skip-button-container',
      '.ytp-ad-player-overlay-instream-info',
      '#player-ads'
    ];

    selectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      } catch(e) {}
    });
  };

  const skipAdButton = () => {
    try {
      const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-standard');
      if (skipBtn) {
        skipBtn.click();
        return true;
      }
    } catch(e) {}
    return false;
  };

  const skipVideoAd = () => {
    try {
      const video = document.querySelector('video');
      const adOverlay = document.querySelector('.ytp-ad-player-overlay-instream-info');
      const adPlaying = document.querySelector('.ad-showing');
      
      if (video && video.duration && isFinite(video.duration) && (adOverlay || adPlaying)) {
        const adDuration = video.getCurrentTime?.() || 0;
        if (adDuration < video.duration - 0.1) {
          video.currentTime = video.duration;
        }
      }
    } catch(e) {}
  };

  const init = () => {
    injectCSS();
    hideAdElements();

    setInterval(() => {
      hideAdElements();
      skipAdButton();
      skipVideoAd();
    }, 500);

    const observer = new MutationObserver(() => {
      hideAdElements();
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  setTimeout(init, 2000);
  setTimeout(init, 5000);

})();
