// src/history.js

document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('history-container');

    fetch('http://localhost:3000/api/history')
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
