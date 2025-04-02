function validateBooking() {
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const arrivalDate = document.getElementById('arrivalDate').value;
    const departureDate = document.getElementById('departureDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const placeType = document.getElementById('placeType').value;
    const description = document.getElementById('description').value;

    let errorMessage = "";

    if (!name || !contact || !arrivalDate || !departureDate || !paymentMethod || !placeType || !description) {
        errorMessage = "Please fill in all required fields.";
    }

    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    // Simulate booking confirmation
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingConfirmation').style.display = 'block';

    
}