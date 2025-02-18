const firebaseConfig = {
    apiKey: "AIzaSyDAYL5q-CG3bU1VuRs3PVZ11CUm34ML5BM",
    authDomain: "dataloger-48c70.firebaseapp.com",
    databaseURL: "https://dataloger-48c70-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dataloger-48c70",
    storageBucket: "dataloger-48c70.firebasestorage.app",
    messagingSenderId: "651248484497",
    appId: "1:651248484497:web:0c5ab0d250049b2a99bf30",
    measurementId: "G-Q795NPXTMR"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const logsRef = db.ref("logs");
const lastTimeRef = db.ref("last_time");
const incubatorDataRef = db.ref("incubator_data");

// Show loading animation
document.getElementById("loading").style.display = "block";

// Get modal elements
const dayModal = document.getElementById("deleteModal");
const hourModal = document.getElementById("deleteHourModal");
const resetModal = document.getElementById("resetModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDeleteHour = document.getElementById("cancelDeleteHour");
const confirmDeleteHour = document.getElementById("confirmDeleteHour");
const resetButton = document.getElementById("resetButton");
const cancelReset = document.getElementById("cancelReset");
const confirmReset = document.getElementById("confirmReset");
const resetConfirmCheckbox = document.getElementById("resetConfirmCheckbox");
let currentDayToDelete = null;
let currentHourToDelete = null;
let currentDayForHour = null;

// Reset button functionality
resetButton.onclick = function() {
    resetModal.style.display = "block";
}

// Enable/disable confirm reset button based on checkbox
resetConfirmCheckbox.onchange = function() {
    confirmReset.disabled = !this.checked;
}

// Reset confirmation button
confirmReset.onclick = function() {
    // Reset last_time node
    lastTimeRef.set({
        days: 0,
        hours: 0,
        minutes: 0
    })
    // Delete all logs
    .then(() => logsRef.remove())
    // Delete all incubator data
    .then(() => incubatorDataRef.remove())
    .then(() => {
        alert("System has been reset successfully");
        resetModal.style.display = "none";
        resetConfirmCheckbox.checked = false;
        confirmReset.disabled = true;
        // Reload the page to reflect changes
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error resetting system:", error);
        alert("Error resetting system. Please try again.");
        resetModal.style.display = "none";
        resetConfirmCheckbox.checked = false;
        confirmReset.disabled = true;
    });
}

// Cancel reset
cancelReset.onclick = function() {
    resetModal.style.display = "none";
    resetConfirmCheckbox.checked = false;
    confirmReset.disabled = true;
}

// Close modals when clicking cancel
cancelDelete.onclick = function() {
    dayModal.style.display = "none";
}

cancelDeleteHour.onclick = function() {
    hourModal.style.display = "none";
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == dayModal) {
        dayModal.style.display = "none";
    }
    if (event.target == hourModal) {
        hourModal.style.display = "none";
    }
    if (event.target == resetModal) {
        resetModal.style.display = "none";
        resetConfirmCheckbox.checked = false;
        confirmReset.disabled = true;
    }
}

logsRef.once("value", function (snapshot) {
const data = snapshot.val();
if (data) {
const buttonsContainer = document.getElementById("buttons-container");

Object.keys(data).forEach(dayNode => {
    // Create container for day button and delete button
    const dayButtonContainer = document.createElement('div');
    dayButtonContainer.className = 'day-button-container';

    // Create Day Button
    const dayButton = document.createElement('button');
    dayButton.className = 'btn btn-primary';
    dayButton.style.flex = '1';
    dayButton.textContent = `${dayNode.charAt(0).toUpperCase() + dayNode.slice(1)}`;

    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-delete';
    deleteButton.textContent = 'Delete';

    // Add delete functionality
    deleteButton.onclick = function(e) {
        e.stopPropagation();
        currentDayToDelete = dayNode;
        dayModal.style.display = "block";
    }

    // Add buttons to container
    dayButtonContainer.appendChild(dayButton);
    dayButtonContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(dayButtonContainer);

    // Create Table Container
    const dayTableContainer = document.createElement('div');
    dayTableContainer.className = 'data-table-container';
    dayTableContainer.id = `${dayNode}-data`;
    document.getElementById("tables-container").appendChild(dayTableContainer);

    // Attach isOpen state to the button
    dayButton.isOpen = false;

    dayButton.addEventListener('click', function () {
        // Close all other day tables
        document.querySelectorAll('.data-table-container').forEach(container => {
            if (container.id !== `${dayNode}-data`) {
                container.style.display = 'none';
            }
        });

        // Remove active class from all buttons
        document.querySelectorAll('#buttons-container .btn-primary').forEach(button => {
            button.classList.remove('active');
        });

        if (dayButton.isOpen) {
            dayTableContainer.style.display = 'none';
            dayButton.classList.remove('active');
            dayButton.isOpen = false;
        } else {
            if (!dayTableContainer.innerHTML) {
                const dayData = data[dayNode];
                Object.keys(dayData).forEach(hourNode => {
                    const hourData = dayData[hourNode];
                    const tableContainer = document.createElement('div');
                    tableContainer.className = 'table-responsive';
                    tableContainer.id = `${dayNode}-${hourNode}-container`;

                    const tableTitle = document.createElement('div');
                    tableTitle.className = 'table-title';
                    tableTitle.textContent = `Data for ${dayNode} - ${hourNode}`;
                    tableContainer.appendChild(tableTitle);

                    const table = document.createElement('table');
                    table.className = 'table table-bordered table-hover';
                    const thead = document.createElement('thead');
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <th>Minutes</th>
                        <th>Button Turner</th>
                        <th>Egg Turner</th>
                        <th>Fan Status</th>
                        <th>Heater Status</th>
                        <th>Humidity</th>
                        <th>Temperature</th>
                        <th>Water Presence</th>
                    `;
                    thead.appendChild(tr);
                    table.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    table.appendChild(tbody);

                    Object.keys(hourData).forEach(minuteNode => {
                        const minuteData = hourData[minuteNode];
                        const row = tbody.insertRow();
                        row.innerHTML = `
                            <td>${minuteNode}</td>
                            <td>${minuteData.Button_turner_status || ''}</td>
                            <td>${minuteData.Egg_turner_status || ''}</td>
                            <td>${minuteData['Fan Status'] || ''}</td>
                            <td>${minuteData.Heater_status || ''}</td>
                            <td>${minuteData.Humidity || ''}</td>
                            <td>${minuteData.Temperature || ''}</td>
                            <td>${minuteData.Water_presense || ''}</td>
                        `;
                    });

                    tableContainer.appendChild(table);

                    // Button group container
                    const buttonGroup = document.createElement('div');
                    buttonGroup.className = 'button-group';

                    // Download Button
                    const downloadButton = document.createElement('button');
                    downloadButton.className = 'btn btn-success';
                    downloadButton.textContent = 'Download PDF';

                    // Delete Hour Button
                    const deleteHourButton = document.createElement('button');
                    deleteHourButton.className = 'btn btn-delete';
                    deleteHourButton.textContent = 'Delete Hour';

                    // Add click handlers
                    downloadButton.addEventListener('click', function () {
                        buttonGroup.style.display = 'none';
                        const opt = {
                            margin: 0.5,
                            filename: `Data_${dayNode}_${hourNode}.pdf`,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'legal', orientation: 'landscape' }
                        };
                        html2pdf()
                            .from(tableContainer)
                            .set(opt)
                            .save()
                            .then(() => {
                                buttonGroup.style.display = 'flex';
                            });
                    });

                    deleteHourButton.addEventListener('click', function() {
                        currentHourToDelete = hourNode;
                        currentDayForHour = dayNode;
                        hourModal.style.display = "block";
                    });

                    // Add buttons to group
                    buttonGroup.appendChild(downloadButton);
                    buttonGroup.appendChild(deleteHourButton);
                    tableContainer.appendChild(buttonGroup);
                    dayTableContainer.appendChild(tableContainer);
                });
            }
            dayTableContainer.style.display = 'block';
            dayButton.classList.add('active');
            dayButton.isOpen = true;
        }
    });
});

// Configure delete day confirmation
confirmDelete.onclick = function() {
    if (currentDayToDelete) {
        db.ref(`logs/${currentDayToDelete}`).remove()
            .then(() => {
                const buttonContainers = document.querySelectorAll('.day-button-container');
                buttonContainers.forEach(container => {
                    if (container.querySelector('button').textContent.toLowerCase() === currentDayToDelete) {
                        container.remove();
                    }
                });
                const tableContainer = document.getElementById(`${currentDayToDelete}-data`);
                if (tableContainer) {
                    tableContainer.remove();
                }
                dayModal.style.display = "none";
                currentDayToDelete = null;
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
                alert("Error deleting data. Please try again.");
                dayModal.style.display = "none";
                currentDayToDelete = null;
            });
    }
}

// Configure delete hour confirmation
confirmDeleteHour.onclick = function() {
    if (currentHourToDelete && currentDayForHour) {
        db.ref(`logs/${currentDayForHour}/${currentHourToDelete}`).remove()
            .then(() => {
                const hourContainer = document.getElementById(`${currentDayForHour}-${currentHourToDelete}-container`);
                if (hourContainer) {
                    hourContainer.remove();
                }
                hourModal.style.display = "none";
                currentHourToDelete = null;
                currentDayForHour = null;
            })
            .catch((error) => {
                console.error("Error deleting hour data:", error);
                alert("Error deleting hour data. Please try again.");
                hourModal.style.display = "none";
                currentHourToDelete = null;
                currentDayForHour = null;
            });
    }
}
}

// Hide loading animation after data is loaded
document.getElementById("loading").style.display = "none";
});