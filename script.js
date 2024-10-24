// Get the navigation bar and toggle button  
const nav = document.querySelector('nav');  
const toggleButton = document.querySelector('.toggle-button');  
  
// Add event listener to toggle button  
toggleButton.addEventListener('click', () => {  
  nav.classList.toggle('show');  
});
// Get the buttons  
const registerButton = document.querySelector('#register-button');  
const applyCertificatesButton = document.querySelector('#apply-certificates-button');  
const updatePaymentDetailsButton = document.querySelector('#update-payment-details-button');  
const downloadReceiptButton = document.querySelector('#download-receipt-button');  
const accommodationButton = document.querySelector('#accommodation-button');  
  
// Add event listeners to the buttons  
registerButton.addEventListener('click', () => {  
  window.location.href = 'register.html';  
});  
  
applyCertificatesButton.addEventListener('click', () => {  
  window.location.href = 'apply-certificates.html';  
});  
  
updatePaymentDetailsButton.addEventListener('click', () => {  
  window.location.href = 'update-payment-details.html';  
});  
  
downloadReceiptButton.addEventListener('click', () => {  
  window.location.href = 'download-receipt.html';  
});  
  
accommodationButton.addEventListener('click', () => {  
  window.location.href = 'accommodation.html';  
});
