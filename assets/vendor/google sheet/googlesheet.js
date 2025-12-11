
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_ktgKadzPqHgHQhFInK9MDMt-oKadJXCqSKfrpATMOpNGLlEC3P7IkBnZ_aATH0SB/exec';

    // List forms with their Google Sheet target names
    const formsToTrack = [
        { id: 'myForm', sheetName: 'order' }, 
        { id: 'myForm2', sheetName: 'message' }
    ];

    function handleFormSubmission(formElement, targetSheetName) {

        // UI elements
        const loadingDiv = formElement.querySelector('.loading');
        const errorMessageDiv = formElement.querySelector('.error-message');
        const sentMessageDiv = formElement.querySelector('.sent-message');

        // Reset UI state
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (errorMessageDiv) errorMessageDiv.style.display = 'none';
        if (sentMessageDiv) sentMessageDiv.style.display = 'none';

        // Prepare form data
        const formData = new FormData(formElement);
        formData.append('targetSheet', targetSheetName); // IMPORTANT
        const urlEncodedData = new URLSearchParams(formData).toString();

        // Send POST request
        fetch(WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlEncodedData
        })
        .then(response => response.text())
        .then(data => {
            if (loadingDiv) loadingDiv.style.display = 'none';

            if (data.includes('Success')) {
                if (sentMessageDiv) sentMessageDiv.style.display = 'block';
                formElement.reset();
            } else {
                if (errorMessageDiv) {
                    errorMessageDiv.style.display = 'block';
                    errorMessageDiv.textContent = 'Server Error: ' + data;
                }
            }
        })
        .catch(error => {
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (errorMessageDiv) {
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.textContent = 'Network Error: Submission failed.';
            }
            console.error('Submission Error:', error);
        });
    }

    // Initialize all forms
    formsToTrack.forEach(item => {
        const form = document.getElementById(item.id);

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(form, item.sheetName);
            });

            // Hide status messages initially
            const loadingDiv = form.querySelector('.loading');
            const errorMessageDiv = form.querySelector('.error-message');
            const sentMessageDiv = form.querySelector('.sent-message');
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (errorMessageDiv) errorMessageDiv.style.display = 'none';
            if (sentMessageDiv) sentMessageDiv.style.display = 'none';
        }
    });
