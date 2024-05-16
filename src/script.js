document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('currentUser');

    function bookMeeting(expertName) {
        fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, expertName })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateButton(expertName, data.booked);
                    updateBookedList();
                    alert(data.message);
                } else {
                    alert('Error booking the meeting: ' + data.message);
                }
            })
            .catch(err => alert('An error occurred while booking the meeting'));
    }

    function updateButton(expertName, booked) {
        const buttons = document.querySelectorAll(`[data-expert='${expertName}']`);
        buttons.forEach(button => {
            if (booked) {
                button.classList.add('booked');
                button.style.backgroundColor = 'orange';
                button.textContent = 'Cancel Meeting';
                button.style.pointerEvents = 'none';
            } else {
                button.classList.remove('booked');
                button.style.backgroundColor = '';
                button.textContent = 'Book Meeting';
                button.style.pointerEvents = 'auto';
            }
        });
    }

    function updateBookedList() {
        fetch('/api/bookings')
            .then(response => response.json())
            .then(data => {
                const bookedList = document.getElementById('booked-startups-list');
                bookedList.innerHTML = '';
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
