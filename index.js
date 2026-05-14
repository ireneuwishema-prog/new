// ==============================================
// CART DATA STRUCTURE
// ==============================================

// Cart array to store items - each item will be an object with name and price
let cart = [];
// Variable to store the running subtotal of all items in cart
let subtotal = 0;

// ==============================================
// SHIPPING CONFIGURATION
// ==============================================

// Free shipping threshold - if subtotal reaches or exceeds 200,000 FRW, shipping is free
const FREE_SHIPPING_THRESHOLD = 200000;

// Shipping rates by district - object mapping district option values to shipping costs in FRW
const shippingRates = {
    '0': 0,        // No district selected - default value, no shipping cost
    '500': 500,    // Gasabo district - 500 FRW delivery fee
    '1000': 1000,  // Kicukiro district - 1,000 FRW delivery fee
    '1500': 1500,  // Busanza district - 1,500 FRW delivery fee
    '800': 800     // Kagarama district - 800 FRW delivery fee
};

// ==============================================
// DOM ELEMENT REFERENCES
// ==============================================

// Get all elements with class 'productsBtn' (all Add to Cart buttons)
const productBtn = document.getElementsByClassName('productsBtn');
// Get the div element where cart items will be displayed
const cartItemsDiv = document.getElementById('cart-items');
// Get the span element that displays the subtotal amount
const subtotalSpan = document.getElementById('subtotal');
// Get the select dropdown element for district selection
const districtSelect = document.getElementById('district');
// Get the span element that displays shipping cost
const shippingSpan = document.getElementById('shipping');
// Get the span element that displays total amount (subtotal + shipping)
const totalSpan = document.getElementById('total');
// Get the paragraph element that shows free shipping messages
const freeShippingMsg = document.getElementById('free-shipping-msg');
// Get the Apply Now button element
const applyButton = document.querySelector('.Apply');
// Get the paragraph element that displays error or success messages
const errorMessage = document.getElementById('errormessage');

// ==============================================
// FLOATING CART ELEMENTS - NEW!
// ==============================================

// Get floating cart elements for always-visible total
const floatingCartCount = document.getElementById('floating-cart-count');
const floatingSubtotal = document.getElementById('floating-subtotal');
const floatingShipping = document.getElementById('floating-shipping');
const floatingTotal = document.getElementById('floating-total');
const floatingCartDiv = document.getElementById('floatingCart');

// ==============================================
// ADD TO CART FUNCTIONALITY
// ==============================================

// Loop through all product buttons (using traditional for loop for compatibility)
for (let i = 0; i < productBtn.length; i++) {
    // Add click event listener to each product button
    productBtn[i].addEventListener('click', function() {
        // Get the product name from the custom data-name attribute
        const name = this.getAttribute('data-name');
        // Get the product price from the custom data-price attribute and convert to integer
        const price = parseInt(this.getAttribute('data-price'));
        
        // Call addToCart function with the product name and price
        addToCart(name, price);
        
        // NEW: Highlight floating cart to draw attention
        highlightFloatingCart();
    });
}

// NEW: Function to highlight floating cart when item is added
function highlightFloatingCart() {
    // Add highlight class to floating cart
    floatingCartDiv.classList.add('highlight');
    // Remove highlight class after 1 second
    setTimeout(() => {
        floatingCartDiv.classList.remove('highlight');
    }, 1000);
}

// Function to add a new item to the shopping cart
function addToCart(name, price) {
    // Push new item object (with name and price) into the cart array
    cart.push({ name: name, price: price });
    // Update the visual display of cart items
    updateCartDisplay();
    // Recalculate all totals (subtotal, shipping, total)
    updateCalculations();
    // Update the floating cart display
    updateFloatingCart();
    // Show a brief confirmation message when item is added
    showAddToCartConfirmation(name, price);
    // Scroll to cart section on mobile to show user the total
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            document.querySelector('.cart').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
    }
}

// Function to show a temporary confirmation when item is added
function showAddToCartConfirmation(name, price) {
    // Create a temporary div for confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'add-confirmation';
    confirmation.innerHTML = `✅ Added: ${name} - ${price.toLocaleString()} frw`;
    // Add to the top of products section
    const productsSection = document.querySelector('.products');
    productsSection.parentNode.insertBefore(confirmation, productsSection);
    // Remove the confirmation after 2 seconds
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// NEW: Function to update floating cart display
function updateFloatingCart() {
    // Update item count
    if (floatingCartCount) {
        floatingCartCount.textContent = cart.length;
    }
    
    // Update subtotal in floating cart
    if (floatingSubtotal) {
        floatingSubtotal.textContent = subtotal.toLocaleString();
    }
    
    // Get current shipping cost
    const selectedDistrict = districtSelect.value;
    let shippingCost = shippingRates[selectedDistrict] || 0;
    
    // Apply free shipping if subtotal exceeds threshold
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingCost = 0;
    }
    
    // Update shipping in floating cart
    if (floatingShipping) {
        floatingShipping.textContent = shippingCost.toLocaleString();
    }
    
    // Calculate and update total in floating cart
    const total = subtotal + shippingCost;
    if (floatingTotal) {
        floatingTotal.textContent = total.toLocaleString();
    }
    
    // Change floating cart color based on total amount
    if (total > 0 && total < FREE_SHIPPING_THRESHOLD) {
        floatingCartDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (total >= FREE_SHIPPING_THRESHOLD) {
        floatingCartDiv.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        floatingCartDiv.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            floatingCartDiv.style.animation = '';
        }, 500);
    }
}

// ==============================================
// CART DISPLAY MANAGEMENT
// ==============================================

// Function to update the visual display of cart items in the DOM
function updateCartDisplay() {
    // Clear the cart items container (remove all existing items)
    cartItemsDiv.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        // Create a new paragraph element for empty cart message
        const emptyMsg = document.createElement('p');
        // Set the text content using current language's empty cart message
        emptyMsg.textContent = languageData[currentLanguage].cartEmpty;
        // Style the message with light gray color
        emptyMsg.style.color = '#999';
        // Add the empty message to cart items div
        cartItemsDiv.appendChild(emptyMsg);
    } else {
        // Loop through each item in the cart array with its index position
        cart.forEach((item, index) => {
            // Create a new div element for each cart item
            const cartItem = document.createElement('div');
            // Add CSS class 'cart-item' for styling
            cartItem.className = 'cart-item';
            // Set inner HTML with product name, price, and remove button
            // Use toLocaleString() to format numbers with commas (e.g., 1,000)
            cartItem.innerHTML = `${item.name} - ${item.price.toLocaleString()} frw <button class="remove-btn" data-index="${index}">${languageData[currentLanguage].remove}</button>`;
            // Add the cart item to the cart items container
            cartItemsDiv.appendChild(cartItem);
        });
    }
    
    // Get all remove buttons that were just created
    const removeButtons = document.querySelectorAll('.remove-btn');
    // Loop through each remove button
    for (let i = 0; i < removeButtons.length; i++) {
        // Add click event listener to each remove button
        removeButtons[i].addEventListener('click', function() {
            // Get the index of item to remove from data-index attribute and convert to integer
            const index = parseInt(this.getAttribute('data-index'));
            // Call removeFromCart function with the index
            removeFromCart(index);
        });
    }
}

// Function to remove an item from the cart by its index position
function removeFromCart(index) {
    // Store the removed item name for confirmation message
    const removedItem = cart[index];
    // Remove 1 item at the specified index from cart array
    cart.splice(index, 1);
    // Update the visual display of cart items
    updateCartDisplay();
    // Recalculate all totals after removal
    updateCalculations();
    // Update floating cart display
    updateFloatingCart();
    // Show removal confirmation
    if (removedItem) {
        showRemoveConfirmation(removedItem.name);
    }
}

// Function to show confirmation when item is removed
function showRemoveConfirmation(itemName) {
    const confirmation = document.createElement('div');
    confirmation.className = 'remove-confirmation';
    confirmation.innerHTML = `🗑️ Removed: ${itemName} from cart`;
    confirmation.style.backgroundColor = '#ffebee';
    confirmation.style.color = '#c62828';
    const productsSection = document.querySelector('.products');
    productsSection.parentNode.insertBefore(confirmation, productsSection);
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// ==============================================
// PRICE CALCULATIONS
// ==============================================

// Function to calculate subtotal, shipping, and total amounts
function updateCalculations() {
    // Calculate subtotal by summing all item prices in cart
    // reduce() iterates through array, accumulating sum starting from 0
    subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    // Update subtotal display with formatted number (adds commas)
    subtotalSpan.textContent = subtotal.toLocaleString();
    
    // Get the currently selected district value from dropdown
    const selectedDistrict = districtSelect.value;
    // Get shipping cost based on selected district, default to 0 if not found
    let shippingCost = shippingRates[selectedDistrict] || 0;
    
    // Check if subtotal meets or exceeds free shipping threshold
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        // Set shipping cost to zero if threshold is met
        shippingCost = 0;
        // Display free shipping congratulatory message in current language
        freeShippingMsg.textContent = languageData[currentLanguage].freeDelivery;
        // NEW: Add celebration effect
        celebrateFreeShipping();
    } else {
        // Clear the free shipping message if threshold not met
        freeShippingMsg.textContent = '';
    }
    
    // Update shipping display with formatted number
    shippingSpan.textContent = shippingCost.toLocaleString();
    
    // Calculate total amount (subtotal + shipping cost)
    const total = subtotal + shippingCost;
    // Update total display with formatted number
    totalSpan.textContent = total.toLocaleString();
    
    // NEW: Update floating cart with latest calculations
    updateFloatingCart();
}

// NEW: Celebration effect when free shipping is achieved
function celebrateFreeShipping() {
    // Add celebration class to floating cart
    floatingCartDiv.classList.add('celebrate');
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
    // Remove celebration class after 2 seconds
    setTimeout(() => {
        floatingCartDiv.classList.remove('celebrate');
    }, 2000);
}

// NEW: Create confetti effect for free shipping
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(confetti);
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// ==============================================
// DISTRICT SELECTION HANDLER
// ==============================================

// Add event listener for when user changes district selection
districtSelect.addEventListener('change', function() {
    // Recalculate all totals (shipping cost will update based on new district)
    updateCalculations();
});

// ==============================================
// CHECKOUT/APPLY BUTTON HANDLER
// ==============================================

// Add event listener for Apply Now button click
applyButton.addEventListener('click', function() {
    // Check if cart is empty
    if (cart.length === 0) {
        // Display error message about empty cart in current language
        errorMessage.textContent = languageData[currentLanguage].errorEmptyCart;
        // Set error message text color to red
        errorMessage.style.color = 'red';
    } 
    // Check if no district has been selected (value is '0')
    else if (districtSelect.value === '0') {
        // Display error message asking to select district
        errorMessage.textContent = languageData[currentLanguage].errorSelectDistrict;
        // Set error message text color to red
        errorMessage.style.color = 'red';
    } 
    // If cart has items AND a district is selected
    else {
        // Get the total amount, removing any commas for parseInt
        const total = parseInt(totalSpan.textContent.replace(/,/g, ''));
        // Display success message with total amount in current language
        errorMessage.textContent = `${languageData[currentLanguage].successOrder} ${total.toLocaleString()} frw`;
        // Set success message text color to green
        errorMessage.style.color = 'green';
        
        // Set timeout to clear cart after 3 seconds (3000 milliseconds)
        setTimeout(() => {
            // Empty the cart array
            cart = [];
            // Update cart display to show empty cart
            updateCartDisplay();
            // Reset all calculations to zero
            updateCalculations();
            // Update floating cart to show zero
            updateFloatingCart();
            // Reset district dropdown to default "Select District" option
            districtSelect.value = '0';
            // Clear the error/success message
            errorMessage.textContent = '';
        }, 3000); // 3000 milliseconds = 3 seconds delay
    }
});

// ==============================================
// MULTI-LANGUAGE SUPPORT SYSTEM
// ==============================================

// Get the language selector dropdown element
const languageSelect = document.getElementById('language-select');
// Variable to track currently selected language (default: 'en' for English)
let currentLanguage = 'en';

// Object containing all translated text for three languages
const languageData = {
    // English translations
    en: {
        title: 'Kigali Online Market',
        welcome: 'Welcome to Kigali Online Market',
        products: 'Our Products',
        cart: 'Cart Items',
        addCart: 'Add Cart',
        subtotal: 'Subtotal',
        selectDistrict: 'Select District',
        shipping: 'Shipping',
        total: 'Total',
        applyNow: 'Apply Now',
        remove: 'Remove',
        noDistrict: 'Select Your District',
        gasabo: 'Gasabo - 500 frw',
        kicukiro: 'Kicukiro - 1,000 frw',
        busanza: 'Busanza - 1,500 frw',
        kagarama: 'Kagarama - 800 frw',
        freeDelivery: '🎉 Congratulations! You qualify for FREE delivery!',
        errorEmptyCart: '❌ Your cart is empty! Please add items to cart.',
        errorSelectDistrict: '❌ Please select your delivery district!',
        successOrder: '✅ Order placed successfully! Total:',
        cartEmpty: 'Your cart is empty'
    },
    
    // French translations
    fr: {
        title: 'Marché en Ligne de Kigali',
        welcome: 'Bienvenue au Marché en Ligne de Kigali',
        products: 'Nos Produits',
        cart: 'Articles du Panier',
        addCart: 'Ajouter au Panier',
        subtotal: 'Sous-total',
        selectDistrict: 'Sélectionner le District',
        shipping: 'Livraison',
        total: 'Total',
        applyNow: 'Commander',
        remove: 'Supprimer',
        noDistrict: 'Sélectionner Votre District',
        gasabo: 'Gasabo - 500 frw',
        kicukiro: 'Kicukiro - 1 000 frw',
        busanza: 'Busanza - 1 500 frw',
        kagarama: 'Kagarama - 800 frw',
        freeDelivery: '🎉 Félicitations! Vous bénéficiez de la livraison gratuite!',
        errorEmptyCart: '❌ Votre panier est vide! Ajoutez des articles.',
        errorSelectDistrict: '❌ Veuillez sélectionner votre district!',
        successOrder: '✅ Commande passée avec succès! Total:',
        cartEmpty: 'Votre panier est vide'
    },
    
    // Kinyarwanda translations
    rw: {
        title: 'Murengeza w\'Internet wa Kigali',
        welcome: 'Murakaza neza kuri Murengeza w\'Internet wa Kigali',
        products: 'Ibicuruzwa Byacu',
        cart: 'Ibikubiye mu Kageri',
        addCart: 'Fungurira Akageri',
        subtotal: 'Ayatanze',
        selectDistrict: 'Hitamo Akagari',
        shipping: 'Kubika',
        total: 'Igenga',
        applyNow: 'Fungurira',
        remove: 'Kuramo',
        noDistrict: 'Hitamo Akagari',
        gasabo: 'Gasabo - 500 frw',
        kicukiro: 'Kicukiro - 1,000 frw',
        busanza: 'Busanza - 1,500 frw',
        kagarama: 'Kagarama - 800 frw',
        freeDelivery: '🎉 Mugabe! Mufise kubika buntu!',
        errorEmptyCart: '❌ Akageri mwatwa! Fungurira ibicuruzwa.',
        errorSelectDistrict: '❌ Hitamo akagari!',
        successOrder: '✅ Order yahawe neza! Igenga:',
        cartEmpty: 'Akageri mwatwa'
    }
};

// ==============================================
// LANGUAGE SWITCHING FUNCTION
// ==============================================

// Function to update all UI text when language is changed
function updateLanguage(lang) {
    // Update currentLanguage variable with selected language
    currentLanguage = lang;
    // Get translations object for the selected language
    const data = languageData[lang];
    
    // Update main page title (h1) with translated title and keep cart emoji
    document.querySelector('h1').innerHTML = `🛒${data.title}`;
    // Update welcome marquee text with translated welcome message
    document.querySelector('.darius').textContent = data.welcome;
    
    // Get all h2 headings on the page
    const headings = document.querySelectorAll('h2');
    // Update first h2 (Products heading) if it exists
    if (headings[0]) headings[0].textContent = data.products;
    // Update second h2 (Cart heading) if it exists
    if (headings[1]) headings[1].textContent = data.cart;
    
    // Get all Add to Cart buttons
    const addCartButtons = document.querySelectorAll('.productsBtn');
    // Loop through each button and update its text
    addCartButtons.forEach(btn => {
        btn.textContent = data.addCart;
    });
    
    // Get all remove buttons (if any exist in cart)
    const removeButtons = document.querySelectorAll('.remove-btn');
    // Loop through each remove button and update its text
    removeButtons.forEach(btn => {
        const index = btn.getAttribute('data-index');
        btn.textContent = data.remove;
        btn.setAttribute('data-index', index);
    });
    
    // Update district dropdown label text
    const districtLabel = document.querySelector('label[for="district"]');
    if (districtLabel) districtLabel.innerHTML = `<strong>${data.selectDistrict}:</strong>`;
    
    // Update Apply Now button text if it exists
    if (applyButton) applyButton.textContent = data.applyNow;
    
    // Update all options in district dropdown
    const options = districtSelect.options;
    if (options[0]) options[0].textContent = data.noDistrict;
    if (options[1]) options[1].textContent = data.gasabo;
    if (options[2]) options[2].textContent = data.kicukiro;
    if (options[3]) options[3].textContent = data.busanza;
    if (options[4]) options[4].textContent = data.kagarama;
    
    // Refresh cart display to show translated remove buttons and empty message
    updateCartDisplay();
    
    // If free shipping is currently active, update the message in new language
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingMsg.textContent = data.freeDelivery;
    }
}

// ==============================================
// LANGUAGE SELECTOR EVENT HANDLER
// ==============================================

// Add event listener for when user changes language in dropdown
languageSelect.addEventListener('change', function() {
    // Call updateLanguage function with the newly selected value
    updateLanguage(this.value);
});

// ==============================================
// INITIALIZATION
// ==============================================

// Initialize the page with English language on first load
updateLanguage('en');
// Initialize floating cart display
updateFloatingCart();