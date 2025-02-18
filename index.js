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
  
      // Fetch data
      dataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Update the HTML with the fetched data
          document.getElementById('temperature').textContent = data.temperature || 'N/A';
          document.getElementById('humidity').textContent = data.humidity || 'N/A';
          document.getElementById('water_presence').textContent = data.water_presence || 'N/A';
          document.getElementById('heater_status').textContent = data.heater_status || 'N/A';
          document.getElementById('fan_status').textContent = data.fan_status || 'N/A';
          document.getElementById('set_temperature').textContent = data.set_temperature || 'N/A';
          document.getElementById('Egg_turner_status').textContent = data.Egg_turner_status || 'N/A';
  
  
          // Format the time data
          const time = data.time;
          if (time) {
            const formattedTime = `${time.days} days, ${time.hours}:${time.minutes}:${time.seconds}`;
            document.getElementById('time').textContent = formattedTime;
          } else {
            document.getElementById('time').textContent = 'N/A';
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
  
  
  
        // Function to handle temperature increment and decrement
    const addTempButton = document.getElementById('add_temp');
    const subTempButton = document.getElementById('sub_temp');
  
    addTempButton.addEventListener('click', () => {
      // Fetch the current set_temperature value from Firebase
      dataRef.child('set_temperature').get().then((snapshot) => {
        if (snapshot.exists()) {
          const currentTemperature = snapshot.val();
          const newTemperature = currentTemperature + 1;
  
          // Update the set_temperature value in Firebase
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
      // Fetch the current set_temperature value from Firebase
      dataRef.child('set_temperature').get().then((snapshot) => {
        if (snapshot.exists()) {
          const currentTemperature = snapshot.val();
          const newTemperature = currentTemperature - 1;
  
          // Update the set_temperature value in Firebase
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
  
  
  
  
    // Function to toggle btn_turner_status in Firebase
    const btnTurner = document.getElementById('btn_turner');
    
    btnTurner.addEventListener('click', () => {
      // Get the current text content of the button
      const currentStatus = btnTurner.textContent;
  
      // Determine the new status based on the current status
      let newStatus;
      if (currentStatus === 'Turner is ON') {
        newStatus = 'OFF';
      } else if (currentStatus === 'Turner is OFF') {
        newStatus = 'ON';
      } else {
        console.error('Unknown button state.');
        return;
      }
  
      // Update the Firebase database with the new status
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
      const analyticsPage = document.getElementById('control-page');
      const homeLink = document.getElementById('home-link');
      const analyticsLink = document.getElementById('control-link');
  
      homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        homePage.classList.remove('d-none');
        analyticsPage.classList.add('d-none');
        homeLink.classList.add('active');
        analyticsLink.classList.remove('active');
      });
  
      analyticsLink.addEventListener('click', (e) => {
        e.preventDefault();
        homePage.classList.add('d-none');
        analyticsPage.classList.remove('d-none');
        homeLink.classList.remove('active');
        analyticsLink.classList.add('active');
      });