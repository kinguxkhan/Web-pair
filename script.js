document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const usernameInput = document.getElementById('username');
    const createBtn = document.getElementById('create-btn');
    const linkDisplay = document.getElementById('link-display');
    const linkUrl = document.getElementById('link-url');
    const copyBtn = document.getElementById('copy-btn');
    const statusText = document.getElementById('status-text');
    const newLinkBtn = document.getElementById('new-link-btn');
    
    // Create a connection link
    createBtn.addEventListener('click', async function() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter your name');
            return;
        }
        
        try {
            const response = await fetch('/api/create-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create room');
            }
            
            const data = await response.json();
            linkUrl.textContent = data.link;
            linkDisplay.style.display = 'block';
            
            statusText.textContent = 'Waiting for someone to join...';
            statusText.className = 'waiting';
            
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room. Please try again.');
        }
    });
    
    // Copy link to clipboard
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(linkUrl.textContent)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = linkUrl.textContent;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
                alert('Link copied to clipboard!');
            });
    });
    
    // Create new link
    newLinkBtn.addEventListener('click', function() {
        linkDisplay.style.display = 'none';
        usernameInput.value = '';
    });
    
    // Check if page was loaded with a room parameter (joining a room)
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    const nameParam = urlParams.get('name');
    
    if (roomParam && nameParam) {
        // Auto-join the room
        usernameInput.value = decodeURIComponent(nameParam);
        
        // Simulate joining process
        setTimeout(async () => {
            try {
                const response = await fetch('/api/join-room', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        roomId: roomParam,
                        username: decodeURIComponent(nameParam)
                    })
                });
                
                if (response.ok) {
                    statusText.textContent = 'Connected! You can start chatting.';
                    statusText.className = 'connected';
                }
            } catch (error) {
                console.error('Error joining room:', error);
                statusText.textContent = 'Connection failed. Please try again.';
            }
        }, 1000);
    }
});