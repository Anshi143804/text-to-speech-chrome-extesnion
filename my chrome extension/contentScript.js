chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request); 

    if (request.action === "summarize") {
        console.log("Summarizing text:", request.text); 
        const loadingPopup = document.createElement('div');
        loadingPopup.style.position = 'fixed';
        loadingPopup.style.bottom = '20px';
        loadingPopup.style.right = '20px';
        loadingPopup.style.padding = '10px';
        loadingPopup.style.backgroundColor = '#fff';
        loadingPopup.style.border = '1px solid #ccc';
        loadingPopup.style.zIndex = 1000;
        loadingPopup.innerHTML = `<p>Generating your summary...</p>`;
        document.body.appendChild(loadingPopup);

        fetch('http://localhost:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: request.text, word_count: request.word_count })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received from server:", data); 
            document.body.removeChild(loadingPopup);

            if (data.summary) {
                const summarizedText = data.summary;
                console.log("Summary received:", summarizedText); 
                const summaryPopup = document.createElement('div');
                summaryPopup.style.position = 'fixed';
                summaryPopup.style.bottom = '20px';
                summaryPopup.style.right = '20px';
                summaryPopup.style.padding = '10px';
                summaryPopup.style.backgroundColor = '#fff';
                summaryPopup.style.border = '1px solid #ccc';
                summaryPopup.style.zIndex = 1000;
                summaryPopup.style.width = '300px';
                summaryPopup.style.height = '200px';
                summaryPopup.style.maxWidth = '600px';
                summaryPopup.style.maxHeight = '600px';
                summaryPopup.style.resize = 'both'; 
                summaryPopup.style.overflow = 'auto';
                summaryPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between;">
        <p style="margin: 0; flex-grow: 1;">${summarizedText}</p>
        <button id="closePopup">✖</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="playAudio">Play</button>
        <button id="pauseAudio">Pause</button>
        <button id="stopAudio">Stop</button>
    </div>
    <div id="dragHandle" style="
        position: absolute;
        bottom: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        background: #ffcc00; /* Bright yellow color for better visibility */
        border: 2px solid #333; /* Dark border for contrast */
        border-radius: 50%;
        cursor: grab;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
    "></div>
`;
                document.body.appendChild(summaryPopup);
                const dragHandle = summaryPopup.querySelector('#dragHandle');
                let isDragging = false;
                let offsetX, offsetY;

                dragHandle.onmousedown = function(e) {
                    isDragging = true;
                    offsetX = e.clientX - summaryPopup.getBoundingClientRect().left;
                    offsetY = e.clientY - summaryPopup.getBoundingClientRect().top;
                    dragHandle.style.cursor = 'grabbing';
                };
                document.onmousemove = function(e) {
                    if (isDragging) {
                        summaryPopup.style.left = e.clientX - offsetX + 'px';
                        summaryPopup.style.top = e.clientY - offsetY + 'px';
                    }
                };
                document.onmouseup = function() {
                    isDragging = false;
                    dragHandle.style.cursor = 'grab';
                };

                let speech = new SpeechSynthesisUtterance(summarizedText);
                let isPaused = false;

                document.getElementById('playAudio').addEventListener('click', () => {
                    if (isPaused) {
                        window.speechSynthesis.resume();
                        isPaused = false;
                    } else {
                        window.speechSynthesis.speak(speech);
                    }
                });

                document.getElementById('pauseAudio').addEventListener('click', () => {
                    window.speechSynthesis.pause();
                    isPaused = true;
                });

                document.getElementById('stopAudio').addEventListener('click', () => {
                    window.speechSynthesis.cancel();
                    isPaused = false;
                });

                const closeButton = summaryPopup.querySelector('#closePopup');
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(summaryPopup);
                });
            } else {
                console.error("No summary returned from server.");
            }
            sendResponse({ summary: data.summary });
        })
        .catch(error => {
            console.error('Error fetching summary:', error);
            sendResponse({ error: 'Failed to fetch summary' });
            document.body.removeChild(loadingPopup);
        });
        return true; 
    }
});
