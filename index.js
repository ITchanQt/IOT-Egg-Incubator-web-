    // Firebase configuration
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

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Reference to the node containing the data
    const dataRef = database.ref('/incubator_data');

 // Updated time tracking variables
    let lastTimeUpdate = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timestamp: Date.now()
    };

    let timeCheckInterval;
    const TIME_CHECK_INTERVAL = 10000; // Check every 10 seconds
    const TIME_ALERT_THRESHOLD = 10000; // Show alert if no update for 10 seconds

// Modified data fetch function
    dataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Previous data updates remain the same
        document.getElementById('temperature').textContent = data.temperature || 'N/A';
        document.getElementById('humidity').textContent = data.humidity || 'N/A';
        document.getElementById('water_presence').textContent = data.water_presence || 'N/A';
        document.getElementById('heater_status').textContent = data.heater_status || 'N/A';
        document.getElementById('fan_status').textContent = data.fan_status || 'N/A';
        document.getElementById('set_temperature').textContent = data.set_temperature || 'N/A';
        document.getElementById('Egg_turner_status').textContent = data.Egg_turner_status || 'N/A';

        // Modified time update check
        const time = data.time;
        if (time) {
          const formattedTime = `${time.days} days, ${time.hours}:${time.minutes}:${time.seconds}`;
          document.getElementById('time').textContent = formattedTime;

          // Check if time has changed
          if (time.days !== lastTimeUpdate.days ||
              time.hours !== lastTimeUpdate.hours ||
              time.minutes !== lastTimeUpdate.minutes ||
              time.seconds !== lastTimeUpdate.seconds) {
            
            // Time has changed, update our reference
            lastTimeUpdate = {
              ...time,
              timestamp: Date.now()
            };
            
            // Hide alert when time is running
            document.getElementById('timeAlert').style.display = 'none';
          }
        } else {
          document.getElementById('time').textContent = 'N/A';
          // Show alert if no time data
          document.getElementById('timeAlert').style.display = 'block';
        }

        // Update btn_turner based on btn_turner_status
        const btnTurner = document.getElementById('btn_turner');
        if (data.Btn_turner_status === 'ON') {
          btnTurner.textContent = 'Turner is ON';
          btnTurner.classList.remove('btn-warning');
          btnTurner.classList.add('btn-success');
        } else if (data.Btn_turner_status === 'OFF') {
          btnTurner.textContent = 'Turner is OFF';
          btnTurner.classList.remove('btn-success');
          btnTurner.classList.add('btn-warning');
        } else {
          btnTurner.textContent = 'Unknown Status';
          btnTurner.classList.remove('btn-success', 'btn-warning');
          btnTurner.classList.add('btn-secondary');
        }
      } else {
        document.getElementById('content').textContent = 'No data available.';
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    // Modified function to check if time is updating
    function checkTimeUpdates() {
      const currentTime = Date.now();
      const timeSinceLastUpdate = currentTime - lastTimeUpdate.timestamp;

      if (timeSinceLastUpdate > TIME_ALERT_THRESHOLD) {
        // Show the alert and keep it visible
        document.getElementById('timeAlert').style.display = 'block';
      }
    }

    // Start checking for time updates
    timeCheckInterval = setInterval(checkTimeUpdates, TIME_CHECK_INTERVAL);

    // Clean up interval when page is unloaded
    window.addEventListener('beforeunload', () => {
      if (timeCheckInterval) {
        clearInterval(timeCheckInterval);
      }
    });

// Function to handle temperature increment and decrement
const addTempButton = document.getElementById('add_temp');
const subTempButton = document.getElementById('sub_temp');

addTempButton.addEventListener('click', () => {
  dataRef.child('set_temperature').get().then((snapshot) => {
    if (snapshot.exists()) {
      let currentTemperature = Number(snapshot.val()); // Convert to number
      let newTemperature = currentTemperature + 1;

      dataRef.update({ set_temperature: newTemperature })
        .then(() => {
          console.log(`Temperature incremented to ${newTemperature}`);
        })
        .catch((error) => {
          console.error('Error incrementing temperature:', error);
        });
    } else {
      console.error('set_temperature value not found in the database.');
    }
  }).catch((error) => {
    console.error('Error fetching set_temperature:', error);
  });
});

subTempButton.addEventListener('click', () => {
  dataRef.child('set_temperature').get().then((snapshot) => {
    if (snapshot.exists()) {
      let currentTemperature = Number(snapshot.val()); // Convert to number
      let newTemperature = currentTemperature - 1;

      dataRef.update({ set_temperature: newTemperature })
        .then(() => {
          console.log(`Temperature decremented to ${newTemperature}`);
        })
        .catch((error) => {
          console.error('Error decrementing temperature:', error);
        });
    } else {
      console.error('set_temperature value not found in the database.');
    }
  }).catch((error) => {
    console.error('Error fetching set_temperature:', error);
  });
});


    // Turner control button
    const btnTurner = document.getElementById('btn_turner');
    
    btnTurner.addEventListener('click', () => {
      const currentStatus = btnTurner.textContent;
      let newStatus;
      if (currentStatus === 'Turner is ON') {
        newStatus = 'OFF';
      } else if (currentStatus === 'Turner is OFF') {
        newStatus = 'ON';
      } else {
        console.error('Unknown button state.');
        return;
      }

      dataRef.update({
        Btn_turner_status: newStatus
      }).then(() => {
        console.log(`Turner status updated to ${newStatus}`);
      }).catch((error) => {
        console.error('Error updating turner status:', error);
      });
    });

    // Navigation logic
    const homePage = document.getElementById('home-page');
    const controlPage = document.getElementById('control-page');
    const homeLink = document.getElementById('home-link');
    const controlLink = document.getElementById('control-link');

    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      homePage.classList.remove('d-none');
      controlPage.classList.add('d-none');
      homeLink.classList.add('active');
      controlLink.classList.remove('active');
    });

    controlLink.addEventListener('click', (e) => {
        e.preventDefault();
      homePage.classList.add('d-none');
      controlPage.classList.remove('d-none');
      homeLink.classList.remove('active');
      controlLink.classList.add('active');
    });