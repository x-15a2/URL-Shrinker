// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === 'shorten' && msg.url) {
    // Try to create an offscreen document (Chromium 109+)
    (async () => {
      try {
        const hasOffscreen = await chrome.offscreen.hasDocument?.();
        if (!hasOffscreen) {
          await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['DOM_PARSER'],
            justification: 'Perform network request to is.gd without page CSP.'
          });
        }
      } catch (e) {
        // ignore creation errors; we'll still attempt message send
      }
      // Forward request to offscreen page
      chrome.runtime.sendMessage({ action: 'offscreen-short', url: msg.url }, (response) => {
        sendResponse(response);
      });
    })();
    return true;
  }
});
