// src/adminScript.js

document.addEventListener('DOMContentLoaded', () => {
    const bookingsContainer = document.getElementById('bookings-container');
    const startupsContainer = document.getElementById('startups-container');
    const bookings = JSON.parse(localStorage.getItem('bookings')) || {};

    // Helper function to generate a safe ID from a username
    function generateUserId(username) {
        return username.toLowerCase().replace(/[^a-z0-9]+/g, '');
    }

    // Clear existing content in containers
    bookingsContainer.innerHTML = '';
    startupsContainer.innerHTML = '';

    // Populate user boxes
    for (const [user, experts] of Object.entries(bookings)) {
        const userId = generateUserId(user);
        let userBox = document.getElementById(userId);

        // Create user box if it does not exist
        if (!userBox) {
            userBox = document.createElement('div');
            userBox.className = 'user-box';
            userBox.id = userId;
            userBox.innerHTML = `<div class="user-name">${user}</div><ul class="startup-list"></ul>`;
            bookingsContainer.appendChild(userBox);
        }

        const startupList = userBox.querySelector('.startup-list');
        startupList.innerHTML = ''; // Clear previous content

        // Populate user-specific bookings
        experts.forEach(expert => {
            const expertItem = document.createElement('li');
            expertItem.textContent = expert;
            startupList.appendChild(expertItem);
        });
    }

    // Create a list of all startups
    const allStartups = [
        "ToumAI", "Pwn & Patch", "KEREYA", "AquaDeep", "ME MOBILE ECOSYSTEMS", "Prilance", "Subito International",
        "Solar Dev", "Pixii Motors", "CLINICAGRO", "EdTrust", "Wayout", "Peelo", "REEBIRTH", "AMRA", "Yoteqi", "liberrex",
        "AGRIMINGA", "PIP PIP YALAH", "Schoolify", "SEHALINK (ex TA7ALIL.MA)", "KHABIRY", "W.ALLfit", "Wattnow", "Foodeals MEA",
        "DEALKHIR DaaS", "KWIKS FRC", "Jobold", "ILEY'COM", "Lmarchi.ma", "HOPEZ", "HISTORIAR", "Flouci (By Kaoun)", "eSteps Health"
    ];

    // Populate startups FAQ section
    allStartups.forEach(startup => {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        faqItem.innerHTML = `<h3>${startup}</h3><div class="faq-item-content"></div>`;
        startupsContainer.appendChild(faqItem);

        faqItem.addEventListener('click', () => {
            const content = faqItem.querySelector('.faq-item-content');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        const content = faqItem.querySelector('.faq-item-content');

        // Populate startup-specific bookings
        for (const [user, experts] of Object.entries(bookings)) {
            if (experts.includes(startup)) {
                const userItem = document.createElement('p');
                userItem.textContent = user;
                content.appendChild(userItem);
            }
        }
    });

    // Function to clear all bookings
    window.clearBookings = function() {
        localStorage.removeItem('bookings');
        alert('All bookings have been cleared.');
        location.reload();
    };
});
