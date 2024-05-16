document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('currentUser');

    function bookMeeting(expertName) {
        fetch('https://matchingplatform-fab-maroc.onrender.com/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, expertName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Use text() instead of json() to handle empty responses
            })
            .then(text => {
                if (!text) {
                    throw new Error('Empty response');
                }
                const data = JSON.parse(text);
                console.log('Response Data:', data);
                if (data.success) {
                    updateButton(expertName, data.booked);
                    updateBookedList();
                    alert(data.message);
                } else {
                    alert('Error booking the meeting: ' + data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('An error occurred while booking the meeting');
            });
    }

    function updateButton(expertName, booked) {
        const buttons = document.querySelectorAll(`[data-expert='${expertName}']`);
        buttons.forEach(button => {
            if (booked) {
                button.classList.add('booked');
                button.style.backgroundColor = 'orange';
                button.textContent = 'Cancel Meeting';
                button.style.pointerEvents = 'auto';
            } else {
                button.classList.remove('booked');
                button.style.backgroundColor = '';
                button.textContent = 'Book Meeting';
                button.style.pointerEvents = 'auto';
            }
        });
    }

    function updateBookedList() {
        fetch('https://matchingplatform-fab-maroc.onrender.com/api/bookings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Use text() instead of json() to handle empty responses
            })
            .then(text => {
                if (!text) {
                    throw new Error('Empty response');
                }
                const data = JSON.parse(text);
                const bookedList = document.getElementById('booked-startups-list');
                bookedList.innerHTML = ''; // Clear previous list
                if (data[userName]) {
                    data[userName].forEach(expertName => {
                        const listItem = document.createElement('li');
                        listItem.textContent = expertName;
                        bookedList.appendChild(listItem);
                    });
                }
            })
            .catch(err => console.log(err));
    }

    document.getElementById('search-bar').addEventListener('keyup', searchExperts);
    document.querySelectorAll('.book-meeting').forEach(button => {
        button.addEventListener('click', (event) => {
            const expertName = event.target.dataset.expert;
            bookMeeting(expertName);
        });
    });

    updateBookedList();
});

function searchExperts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const experts = document.querySelectorAll('.expert-box');
    experts.forEach(expert => {
        const name = expert.querySelector('.expert-name').textContent.toLowerCase();
        const description = expert.querySelector('.startup-description').textContent.toLowerCase();
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            expert.style.display = '';
        } else {
            expert.style.display = 'none';
        }
    });
}
