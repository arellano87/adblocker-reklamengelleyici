document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('enable-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const blockedCount = document.getElementById('blocked-count');
  const trackingCount = document.getElementById('tracking-count');
  const statusBadge = document.getElementById('status-badge');
  
  const refreshBtn = document.getElementById('refresh-btn');
  const pickerBtn = document.getElementById('picker-btn');
  const hoverBtn = document.getElementById('hover-btn');
  const customRulesDiv = document.getElementById('custom-rules');
  const rulesList = document.getElementById('rules-list');
  const rulesCount = document.getElementById('rules-count');
  const clearRulesBtn = document.getElementById('clear-rules');
  let isPickerActive = false;
  let isHoverActive = false;

  function applyTheme(isDark) {
    if (isDark === false) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }

  function updateStatus(enabled) {
    if (enabled) {
      statusBadge.classList.remove('inactive');
      statusBadge.querySelector('span:last-child').textContent = 'Aktif';
    } else {
      statusBadge.classList.add('inactive');
      statusBadge.querySelector('span:last-child').textContent = 'Pasif';
    }
  }

  function loadCounts() {
    chrome.storage.local.get(['blockedCount', 'trackingCount'], (result) => {
      blockedCount.textContent = (result.blockedCount || 0).toLocaleString('tr-TR');
      trackingCount.textContent = (result.trackingCount || 0).toLocaleString('tr-TR');
    });
  }

  function loadCustomRules() {
    chrome.storage.local.get('customRules', (result) => {
      const rules = result.customRules || [];
      if (rules.length > 0) {
        customRulesDiv.style.display = 'block';
        rulesCount.textContent = rules.length;
        rulesList.innerHTML = '';
        rules.forEach((rule, index) => {
          const item = document.createElement('div');
          item.className = 'rule-item';
          item.innerHTML = `
            <span>${rule}</span>
            <button onclick="removeRule(${index})">✕</button>
          `;
          rulesList.appendChild(item);
        });
      } else {
        customRulesDiv.style.display = 'none';
      }
    });
  }

  window.removeRule = function(index) {
    chrome.storage.local.get('customRules', (result) => {
      const rules = result.customRules || [];
      rules.splice(index, 1);
      chrome.storage.local.set({ customRules: rules });
      loadCustomRules();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'RELOAD_CUSTOM_RULES' });
      });
    });
  };

  chrome.storage.local.get(['enabled', 'blockedCount', 'trackingCount', 'darkTheme'], (result) => {
    const isEnabled = result.enabled !== false;
    toggle.checked = isEnabled;
    blockedCount.textContent = ((result.blockedCount || 0)).toLocaleString('tr-TR');
    trackingCount.textContent = ((result.trackingCount || 0)).toLocaleString('tr-TR');
    updateStatus(isEnabled);

    const isDark = result.darkTheme !== false;
    themeToggle.checked = isDark;
    applyTheme(isDark);

    loadCustomRules();
  });

  setInterval(loadCounts, 2000);

  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked });
    updateStatus(toggle.checked);
    chrome.runtime.sendMessage({
      type: 'TOGGLE_EXTENSION',
      enabled: toggle.checked
    });
  });

  themeToggle.addEventListener('change', () => {
    const isDark = themeToggle.checked;
    chrome.storage.local.set({ darkTheme: isDark });
    applyTheme(isDark);
  });

  pickerBtn.addEventListener('click', () => {
    isPickerActive = !isPickerActive;
    if (isPickerActive) {
      isHoverActive = false;
      hoverBtn.classList.remove('active');
      pickerBtn.classList.add('active');
      pickerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_HOVER' });
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_PICKER' });
      });
    } else {
      pickerBtn.classList.remove('active');
      pickerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>';
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_PICKER' });
      });
    }
  });

  hoverBtn.addEventListener('click', () => {
    isHoverActive = !isHoverActive;
    if (isHoverActive) {
      isPickerActive = false;
      pickerBtn.classList.remove('active');
      pickerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>';
      hoverBtn.classList.add('active');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_PICKER' });
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_HOVER' });
      });
    } else {
      hoverBtn.classList.remove('active');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_HOVER' });
      });
    }
  });

  clearRulesBtn.addEventListener('click', () => {
    chrome.storage.local.set({ customRules: [] });
    loadCustomRules();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'RELOAD_CUSTOM_RULES' });
    });
  });

  refreshBtn.addEventListener('click', () => {
    refreshBtn.style.opacity = '0.7';
    refreshBtn.querySelector('svg').style.animation = 'spin 1s linear infinite';
    setTimeout(() => {
      refreshBtn.style.opacity = '1';
      refreshBtn.querySelector('svg').style.animation = '';
    }, 1000);
    chrome.runtime.sendMessage({ type: 'REFRESH_RULES' });
    loadCounts();
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
