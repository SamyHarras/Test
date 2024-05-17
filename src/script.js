document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('currentUser');

    function bookMeeting(expertName) {
        db.collection('bookings').doc(userName).update({
            experts: firebase.firestore.FieldValue.arrayUnion(expertName)
        })
            .then(() => {
                return db.collection('bookingHistory').add({
                    userName,
                    expertName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                updateButton(expertName, true);
                updateBookedList();
                alert('Meeting booked successfully');
            })
            .catch(err => alert('An error occurred while booking the meeting: ' + err.message));
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
        db.collection('bookings').doc(userName).get()
            .then(doc => {
                const bookedList = document.getElementById('booked-startups-list');
                bookedList.innerHTML = '';
                if (doc.exists) {
                    doc.data().experts.forEach(expertName => {
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

function switchTheme() {
    document.body.classList.toggle('dark-mode');
}

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
