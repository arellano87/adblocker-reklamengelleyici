(function() {
  'use strict';

  if (window.location.hostname.includes('youtube.com')) return;

  const adSelectors = [
    'div[class*="ad "]',
    'div[class*=" ads"]',
    'div[id*="ad "]',
    'div[id*=" ads"]',
    '[class*="ad-container"]',
    '[class*="ad_container"]',
    '[class*="advertisement"]',
    '[style*="position: fixed"]',
    '[style*="position:absolute"]',
    '[style*="z-index: 9999"]',
    '[style*="z-index: 999"]',
    '[style*="position: fixed; bottom"]',
    '[style*="position: fixed; top"]',
    '[style*="position: fixed; left"]',
    '[style*="position: fixed; right"]',
    '[style*="position:absolute; bottom"]',
    '[style*="position:absolute; top"]',
    '[style*="position: sticky"]',
    '[class*="popup"]',
    '[class*="pop-up"]',
    '[class*="modal"]',
    '[class*="overlay"]',
    '[class*="sticky"]',
    '[class*="floating"]',
    '[class*="reklam"]',
    '[id*="reklam"]',
    '[class*="reklam-"]',
    '[id*="reklam-"]',
    '[class*="ilan"]',
    '[id*="ilan"]',
    '[class*="ads-"]',
    '[class*="ad-"]',
    '[class*="advertisement"]',
    '[class*="sponsor"]',
    '[class*="promo"]',
    '[class*="banner"]',
    '[class*="promoted"]',
    '[class*="sponsored"]',
    '[class*="affiliate"]',
    '[id*="ads-"]',
    '[id*="ad-"]',
    '[id*="google_ads"]',
    '[id*="advertisement"]',
    '[data-ad]',
    '[data-ads]',
    '[data-advertisement]',
    '[data-ad-slot]',
    '[data-ad-client]',
    '[data-google-query-id]',
    '.adsbygoogle',
    '.adsbygoogle-noabate',
    '.adsbygoogle-pub-none',
    '.ad-container',
    '.ad-wrapper',
    '.ad-banner',
    '.ad-slot',
    '.google-ad',
    '.googleAds',
    '#google_ads_frame',
    'ins.adsbygoogle',
    'ins[data-ad-status="unfilled"]',
    '[id^="google_ads_"]',
    '[id^="div-gpt-ad"]',
    '.dfp-ad',
    '.ad-unit',
    '.ad-placement',
    '.ad-row',
    '.ad-column',
    '.ad-break',
    '.ad-block',
    '.ad-wrapper',
    '.ad-skip',
    '.advertisement',
    '.advert',
    '.reklam',
    '.reklam-container',
    '.reklam-wrapper',
    '.ilan-kutusu',
    '.sag-reklam',
    '.sol-reklam',
    '.ust-reklam',
    '.alt-reklam',
    '.sidebar-reklam',
    '[class*="commercial"]',
    '[class*="marketing"]',
    '.sponsored',
    '.sponsored-content',
    '.sponsor-text',
    '.sponsored-link',
    '.promoted-content',
    '.promoted-video',
    '.promoted-post',
    '.taboola',
    '.outbrain',
    '.mgid',
    '.revcontent',
    '.zergnet',
    '.teads',
    '.infolinks',
    '.content-ad',
    '.display-ad',
    '.native-ad',
    '.dfp-ad',
    '.gpt-ad',
    '.google-dfp',
    '.ssp-ad',
    '[id*="taboola"]',
    '[id*="outbrain"]',
    '[class*="taboola"]',
    '[class*="outbrain"]',
    '.trc_related_container',
    '.OUTBRAIN',
    '.tb_region',
    'ins.adsbygoogle',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="googleads"]',
    'iframe[src*="ads"]',
    'iframe[src*="adframe"]',
    'iframe[src*="adbutler"]',
    'iframe[data-src*="ads"]',
    '[class*="sticky-ad"]',
    '[class*="fixed-ad"]',
    '[class*="floating-ad"]',
    '[class*="popup-ad"]',
    '[class*="modal-ad"]',
    '[class*="interstitial"]',
    '[class*="newsletter-popup"]',
    '[class*="subscribe-popup"]',
    '[id*="cookie-notice"]',
    '[class*="cookie-consent"]',
    '[class*="gdpr-banner"]',
    '[class*="popup-overlay"]',
    '[class*="notification-popup"]',
    'div[aria-label*="Advertisement"]',
    '[aria-label*="Reklam"]',
    '[aria-label*="Ad"]'
  ];

  const trackerSelectors = [
    '[class*="tracking"]',
    '[class*="analytics"]',
    '[class*="pixel"]',
    '[class*="beacon"]',
    '[data-tracking]',
    '[data-analytics]',
    '[data-pixel]',
    'iframe[src*="analytics"]',
    'iframe[src*="tracking"]',
    'iframe[src*="pixel"]',
    'img[src*="pixel"]',
    'img[src*="tracking"]',
    'img[src*="analytics"]',
    'img[src*="beacon"]',
    'script[src*="analytics"]',
    'script[src*="tracking"]',
    'script[src*="hotjar"]',
    'script[src*="mixpanel"]',
    'script[src*="segment"]',
    'script[src*="amplitude"]',
    'script[src*="newrelic"]',
    'noscript img[src*="pixel"]'
  ];

  let adBlocked = 0;
  let trackerBlocked = 0;

  const hideElement = (el, isTracker = false) => {
    if (el && el.style.display !== 'none') {
      el.style.display = 'none !important';
      el.style.visibility = 'hidden !important';
      el.style.height = '0 !important';
      el.style.width = '0 !important';
      el.style.opacity = '0 !important';
      el.style.pointerEvents = 'none !important';
      el.style.position = 'absolute !important';
      el.style.left = '-9999px !important';
      
      if (isTracker) {
        trackerBlocked++;
        chrome.runtime.sendMessage({ type: 'TRACKER_BLOCKED' });
      } else {
        adBlocked++;
        chrome.runtime.sendMessage({ type: 'AD_BLOCKED' });
      }
    }
  };

  const removeAdElements = () => {
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => hideElement(el, false));
      } catch (e) {}
    });
  };

  const removeTrackerElements = () => {
    trackerSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => hideElement(el, true));
      } catch (e) {}
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removeAdElements();
      removeTrackerElements();
    });
  } else {
    removeAdElements();
    removeTrackerElements();
  }

  const observer = new MutationObserver(() => {
    removeAdElements();
    removeTrackerElements();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'id', 'style', 'src', 'data-src']
  });

  setInterval(() => {
    removeAdElements();
    removeTrackerElements();
    
    document.querySelectorAll('div, section, aside').forEach(el => {
      const style = el.getAttribute('style') || '';
      const className = el.className || '';
      const id = el.id || '';
      
      if ((style.includes('position: fixed') || style.includes('position:fixed') || 
          style.includes('position: absolute') || style.includes('position:absolute') ||
          style.includes('position: sticky') || style.includes('position:sticky')) &&
          (style.includes('z-index: 9999') || style.includes('z-index: 999') || 
           style.includes('z-index: 999999') || className.includes('popup') ||
           className.includes('modal') || className.includes('overlay') ||
           className.includes('ad') || className.includes('reklam'))) {
        el.style.display = 'none';
      }
    });
  }, 500);

  const script = document.createElement('script');
  script.textContent = `
    (function() {
      const adDomains = [
        'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
        'google-analytics.com', 'adnxs.com', 'criteo.com', 'taboola.com',
        'outbrain.com', 'mgid.com', 'amazon-adsystem.com', 'facebook.com/tr',
        'hotjar.com', 'mixpanel.com', 'segment.io', 'amplitude.com',
        'newrelic.com', 'sentry.io', 'appsflyer.com', 'adjust.com',
        'tiktok.com', 'tiktokv.com', 'bing.com/bat.js',
        'pagead2.googlesyndication.com', 'tpc.googlesyndication.com',
        'ads.google.com', 'googleads.g.doubleclick.net', 'static.doubleclick.net',
        'cm.doubleclick.net', 'stats.g.doubleclick.net', 'partner.doubleclick.net',
        'm.doubleclick.net', 'adclick.g.doubleclick.net', 'video.doubleclick.net',
        'display.doubleclick.net', '2mdn.net', 'admob.com', 'apis.google.com',
        'googleadservices.com/pagead', 'pagead/aclk'
      ];

      const originalFetch = window.fetch;
      window.fetch = function(url) {
        if (typeof url === 'string') {
          for (let domain of adDomains) {
            if (url.includes(domain)) {
              chrome.runtime.sendMessage({ type: 'AD_BLOCKED' });
              return new Promise(() => {});
            }
          }
        }
        return originalFetch.apply(this, arguments);
      };

      const originalXHR = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string') {
          for (let domain of adDomains) {
            if (url.includes(domain)) {
              chrome.runtime.sendMessage({ type: 'TRACKER_BLOCKED' });
            }
          }
        }
        return originalXHR.apply(this, arguments);
      };

      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function() {
        return originalSend.apply(this, arguments);
      };

      window.eval = function(code) {
        if (code && (code.includes('isAd') || code.includes('AdFramework') || code.includes('google_ads'))) {
          return;
        }
        return eval(code);
      };

      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        const el = originalCreateElement.apply(this, arguments);
        if (tagName.toLowerCase() === 'iframe') {
          const originalSrc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
          Object.defineProperty(el, 'src', {
            get: function() { return this._src || ''; },
            set: function(value) {
              if (value) {
                for (let domain of adDomains) {
                  if (value.includes(domain) || value.includes('/ads/') || value.includes('advertisement')) {
                    chrome.runtime.sendMessage({ type: 'AD_BLOCKED' });
                    value = 'about:blank';
                    break;
                  }
                }
              }
              this._src = value;
            }
          });
          
          Object.defineProperty(el, 'data-src', {
            get: function() { return this._dataSrc || ''; },
            set: function(value) {
              if (value) {
                for (let domain of adDomains) {
                  if (value.includes(domain) || value.includes('/ads/')) {
                    chrome.runtime.sendMessage({ type: 'AD_BLOCKED' });
                    value = '';
                    break;
                  }
                }
              }
              this._dataSrc = value;
            }
          });
        }
        return el;
      };

      if (window.googletag) {
        window.googletag = {
          cmd: [],
          pubads: function() {
            return {
              setTargeting: function() {},
              collapseEmptyDivs: function() {},
              refresh: function() {},
              enableSingleRequest: function() {},
              disableInitialLoad: function() {}
            };
          },
          enableServices: function() {},
          display: function() {}
        };
      }

      if (window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      
      if (window.google_ads) {
        window.google_ads = [];
      }

      if (window.AdSense) {
        window.AdSense = function() { return {}; };
      }

      window.blockAdRequests = true;
    })();
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();

  const style = document.createElement('style');
  style.textContent = `
    .adsbygoogle, .ad-container, .ad-wrapper, .advertisement, 
    .sponsored, .sponsored-content, .taboola, .outbrain,
    .ad-banner, .ad-slot, .ad-unit, .ad-placement,
    [class*="ads-"], [class*="ad-"], [id*="ads-"], [id*="ad-"],
    [data-ad], [data-ads], ins.adsbygoogle,
    iframe[src*="doubleclick"], iframe[src*="googlesyndication"],
    iframe[src*="googleads"], iframe[src*="ads"],
    [class*="reklam"], [id*="reklam"], [class*="ilan"],
    [class*="popup"], [class*="pop-up"], [class*="modal"],
    [class*="sticky"], [class*="floating"],
    [class*="overlay"], [class*="banner"],
    [id*="google_ads"], [id*="div-gpt-ad"],
    [data-google-query-id],
    div[style*="position: fixed"], div[style*="position:fixed"],
    div[style*="position: absolute"], div[style*="position:absolute"],
    div[style*="z-index: 9999"], div[style*="z-index: 999"],
    [class*="commercial"], [class*="marketing"],
    div[class*="ad"], div[id*="ad"],
    [aria-label*="Reklam"], [aria-label*="Ad"], [aria-label*="Advertisement"] {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      left: -9999px !important;
      z-index: -99999 !important;
    }
    
    body[style*="overflow: hidden"] {
      overflow: auto !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  let isPickerMode = false;
  let pickerElements = [];
  let customRules = [];
  let hoverButton = null;
  let currentHoverElement = null;

  function loadCustomRules() {
    chrome.storage.local.get('customRules', (result) => {
      customRules = result.customRules || [];
      applyCustomRules();
    });
  }

  function applyCustomRules() {
    customRules.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none !important';
          el.style.visibility = 'hidden !important';
          el.style.height = '0 !important';
          el.style.overflow = 'hidden !important';
        });
      } catch (e) {}
    });
  }

  function getElementSelector(el) {
    let selector = '';
    
    if (el.id) {
      selector = '#' + el.id;
    } else if (el.className && typeof el.className === 'string') {
      const classes = el.className.trim().split(/\s+/).filter(c => c && c.length < 30);
      if (classes.length > 0) {
        selector = '.' + classes.join('.');
      }
    }
    
    if (!selector) {
      selector = el.tagName.toLowerCase();
      if (el.id) selector += '#' + el.id;
      else if (el.className && typeof el.className === 'string') {
        const classes = el.className.trim().split(/\s+/).filter(c => c && c.length < 30);
        if (classes.length > 0) selector += '.' + classes.join('.');
      }
    }
    
    return selector;
  }

  function showHoverButton(el, x, y) {
    if (hoverButton) hoverButton.remove();
    
    hoverButton = document.createElement('div');
    hoverButton.id = 'arellano-hover-btn';
    hoverButton.innerHTML = '✕';
    hoverButton.title = 'Bu elementi engelle';
    hoverButton.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      z-index: 9999999;
      width: 24px;
      height: 24px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: arellano-pop 0.2s ease;
    `;
    
    hoverButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const selector = getElementSelector(el);
      if (selector && !customRules.includes(selector)) {
        customRules.push(selector);
        chrome.storage.local.set({ customRules: customRules });
        applyCustomRules();
        
        const notif = document.createElement('div');
        notif.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #22c55e;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 9999999;
          font-family: system-ui;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notif.textContent = 'Engellendi: ' + selector;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
      }
      hideHoverButton();
    });
    
    document.body.appendChild(hoverButton);
    currentHoverElement = el;
  }

  function hideHoverButton() {
    if (hoverButton) {
      hoverButton.remove();
      hoverButton = null;
      currentHoverElement = null;
    }
  }

  function startHoverMode() {
    document.addEventListener('mouseover', (e) => {
      if (e.target === document.body || e.target === document.documentElement) {
        hideHoverButton();
        return;
      }
      currentHoverElement = e.target;
      const rect = e.target.getBoundingClientRect();
      showHoverButton(e.target, rect.right - 12, rect.top - 12);
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.relatedTarget && !e.relatedTarget.closest('#arellano-hover-btn')) {
        hideHoverButton();
      }
    });
  }

  function stopHoverMode() {
    hideHoverButton();
  }

  function startPicker() {
    if (isPickerMode) return;
    isPickerMode = true;
    
    document.body.style.cursor = 'crosshair';
    
    const style = document.createElement('style');
    style.id = 'arellano-picker-style';
    style.textContent = `
      .arellano-picker-hover {
        outline: 3px solid #6366f1 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
      }
      .arellano-picker-selected {
        outline: 3px solid #22c55e !important;
        outline-offset: 2px !important;
      }
      @keyframes arellano-pop {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    function handleMouseOver(e) {
      if (!isPickerMode) return;
      if (e.target === document.body || e.target === document.documentElement) return;
      
      document.querySelectorAll('.arellano-picker-hover').forEach(el => {
        el.classList.remove('arellano-picker-hover');
      });
      
      e.target.classList.add('arellano-picker-hover');
    }
    
    function handleClick(e) {
      if (!isPickerMode) return;
      e.preventDefault();
      e.stopPropagation();
      
      const selector = getElementSelector(e.target);
      
      if (selector && !customRules.includes(selector)) {
        customRules.push(selector);
        chrome.storage.local.set({ customRules: customRules });
        
        e.target.classList.remove('arellano-picker-hover');
        e.target.classList.add('arellano-picker-selected');
        
        setTimeout(() => {
          e.target.classList.remove('arellano-picker-selected');
          applyCustomRules();
        }, 500);
        
        alert('Engellendi: ' + selector);
      }
      
      stopPicker();
    }
    
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        stopPicker();
      }
    }
    
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    
    pickerElements = [
      { event: 'mouseover', handler: handleMouseOver },
      { event: 'click', handler: handleClick },
      { event: 'keydown', handler: handleKeyDown }
    ];
  }

  function stopPicker() {
    isPickerMode = false;
    document.body.style.cursor = '';
    
    document.querySelectorAll('.arellano-picker-hover, .arellano-picker-selected').forEach(el => {
      el.classList.remove('arellano-picker-hover', 'arellano-picker-selected');
    });
    
    const pickerStyle = document.getElementById('arellano-picker-style');
    if (pickerStyle) pickerStyle.remove();
    
    pickerElements.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler, true);
    });
    pickerElements = [];
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_PICKER') {
      startPicker();
    }
    if (message.type === 'STOP_PICKER') {
      stopPicker();
    }
    if (message.type === 'START_HOVER') {
      startHoverMode();
    }
    if (message.type === 'STOP_HOVER') {
      stopHoverMode();
    }
    if (message.type === 'RELOAD_CUSTOM_RULES') {
      loadCustomRules();
    }
  });

  loadCustomRules();
  setInterval(applyCustomRules, 1000);

})();
