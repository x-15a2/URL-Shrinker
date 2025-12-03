// Runs in page context as a content script and handles fetch to is.gd
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === 'shorten' && msg.url) {
    const api = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(msg.url)}`;
    fetch(api, { method: 'GET', mode: 'cors' })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          sendResponse({ error: `HTTP ${res.status} ${res.statusText} ${txt}` });
          return;
        }
        const short = await res.text();
        sendResponse({ shortUrl: short.trim() });
      })
      .catch((err) => {
        sendResponse({ error: err.message });
      });
    return true;
  }
});
