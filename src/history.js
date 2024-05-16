// src/history.js
document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');

    fetch('https://matchingplatform-fab-maroc.onrender.com/api/history') // Use deployed server URL
        .then(response => response.json())
        .then(history => {
            history.forEach(record => {
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');
                historyItem.innerHTML = `
                    <p>${record}</p>
                `;
                historyContainer.appendChild(historyItem);
            });
        })
        .catch(err => console.log(err));
});
