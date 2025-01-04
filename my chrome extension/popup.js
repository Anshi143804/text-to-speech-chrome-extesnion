document.addEventListener('DOMContentLoaded', () => {
    const summaryLengthSelector = document.getElementById('summary-length');
  
    // Load saved summary length
    chrome.storage.local.get(['summaryLength'], (result) => {
        summaryLengthSelector.value = result.summaryLength || 'short';
    });
  
    // Save the selected summary length
    summaryLengthSelector.addEventListener('change', () => {
        const selectedLength = summaryLengthSelector.value;
        chrome.storage.local.set({ summaryLength: selectedLength });
    });
  
    // Removed the code for loading and clearing saved summaries
  });
  