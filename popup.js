const shortenBtn = document.getElementById('shortenBtn');
const status = document.getElementById('status');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');

shortenBtn.addEventListener('click', async () => {
  status.textContent = 'Getting active tab...';
  resultDiv.classList.add('hidden');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      status.textContent = 'No active tab URL found.';
      return;
    }
    status.textContent = 'Shortening...';
    chrome.runtime.sendMessage({ action: 'shorten', url: tab.url }, async (response) => {
      if (!response) {
        status.textContent = 'No response.';
        return;
      }
      if (response.error) {
        status.textContent = 'Error: ' + response.error;
        return;
      }
      const short = response.shortUrl;
      shortUrlInput.value = short;
      resultDiv.classList.remove('hidden');

      try {
        await navigator.clipboard.writeText(short);
        status.textContent = 'Short URL copied to clipboard.';
      } catch (err) {
        // fallback
        try {
          const textarea = document.createElement('textarea');
          textarea.value = short;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          status.textContent = 'Short URL copied to clipboard.';
        } catch (e) {
          status.textContent = 'Shortened — copy failed.';
        }
      }
    });
  } catch (err) {
    status.textContent = 'Error: ' + err.message;
  }
});
