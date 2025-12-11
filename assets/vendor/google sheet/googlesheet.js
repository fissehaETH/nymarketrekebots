(function () {
    "use strict";
  
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxs7IAC33PXZ6xEXVibnnAUF_3Fpb7FMvGjzO5PMPBFR2UdxwYqzZvnJsE1DGFRVzLb/exec';
  
    const formsToTrack = [
      { id: 'myForm', sheetName: 'order' }, 
      { id: 'myForm2', sheetName: 'message' }
    ];
  
    // Variables to store user's location
    let userLatitude = '';
    let userLongitude = '';
  
    // Get location on page load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          userLatitude = position.coords.latitude;
          userLongitude = position.coords.longitude;
          console.log("User location captured:", userLatitude, userLongitude);
        },
        function(error) {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  
    formsToTrack.forEach(item => {
      const form = document.getElementById(item.id);
  
      if (form) {
        form.addEventListener('submit', function(event) {
          event.preventDefault();
  
          const thisForm = form;
  
          thisForm.querySelector('.loading').classList.add('d-block');
          thisForm.querySelector('.error-message').classList.remove('d-block');
          thisForm.querySelector('.sent-message').classList.remove('d-block');
  
          let formData = new FormData(thisForm);
          formData.append('targetSheet', item.sheetName);
  
          // Add location captured on page load
          formData.append('latitude', userLatitude);
          formData.append('longitude', userLongitude);
  
          // Send the data
          sendToGoogleSheet(thisForm, formData);
        });
  
        // Hide all messages on load
        const loading = form.querySelector('.loading');
        const error = form.querySelector('.error-message');
        const sent = form.querySelector('.sent-message');
  
        if (loading) loading.classList.remove('d-block');
        if (error) error.classList.remove('d-block');
        if (sent) sent.classList.remove('d-block');
      }
    });
  
    function sendToGoogleSheet(thisForm, formData) {
      fetch(WEB_APP_URL, {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.text())
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
  
        if (data.includes("Success")) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          displayError(thisForm, "Server Error: " + data);
        }
      })
      .catch(err => {
        displayError(thisForm, "Network Error: Submission failed.");
        console.error(err);
      });
    }
  
    function displayError(thisForm, error) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }
  
  })();
  
