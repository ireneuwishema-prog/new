// Cart array to store items
let cart = [];
let subtotal = 0;

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 200000;

// Shipping rates by district
const shippingRates = {
    '0': 0,        // No district selected
    '500': 500,    // Gasabo
    '1000': 1000,  // Kicukiro
    '1500': 1500,  // Busanza
    '800': 800     // Kagarama
};

// DOM Elements
const productBtn = document.getElementsByClassName('productsBtn');
const cartItemsDiv = document.getElementById('cart-items');
const subtotalSpan = document.getElementById('subtotal');
const districtSelect = document.getElementById('district');
const shippingSpan = document.getElementById('shipping');
const totalSpan = document.getElementById('total');
const freeShippingMsg = document.getElementById('free-shipping-msg');
const applyButton = document.querySelector('.Apply');
const errorMessage = document.getElementById('errormessage');

// Add event listeners to all product buttons
for (let i = 0; i < productBtn.length; i++) {
    productBtn[i].addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        addToCart(name, price);
    });
}

// Function to add item to cart
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCartDisplay();
    updateCalculations();
}

// Function to update cart display
function updateCartDisplay() {
    cartItemsDiv.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = languageData[currentLanguage].cartEmpty;
        emptyMsg.style.color = '#999';
        cartItemsDiv.appendChild(emptyMsg);
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `${item.name} - ${item.price.toLocaleString()} frw <button class="remove-btn" data-index="${index}">${languageData[currentLanguage].remove}</button>`;
            cartItemsDiv.appendChild(cartItem);
        });
    }
    
    // Add remove button listeners
    const removeButtons = document.querySelectorAll('.remove-btn');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCalculations();
}

// Function to update calculations
function updateCalculations() {
    // Calculate subtotal
    subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    subtotalSpan.textContent = subtotal.toLocaleString();
    
    // Get selected district shipping cost
    const selectedDistrict = districtSelect.value;
    let shippingCost = shippingRates[selectedDistrict] || 0;
    
    // Apply free shipping if subtotal exceeds threshold
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingCost = 0;
        freeShippingMsg.textContent = languageData[currentLanguage].freeDelivery;
    } else {
        freeShippingMsg.textContent = '';
    }
    
    shippingSpan.textContent = shippingCost.toLocaleString();
    
    // Calculate total
    const total = subtotal + shippingCost;
    totalSpan.textContent = total.toLocaleString();
}

// Event listener for district selection
districtSelect.addEventListener('change', function() {
    updateCalculations();
});

// Event listener for Apply button
applyButton.addEventListener('click', function() {
    if (cart.length === 0) {
        errorMessage.textContent = languageData[currentLanguage].errorEmptyCart;
        errorMessage.style.color = 'red';
    } else if (districtSelect.value === '0') {
        errorMessage.textContent = languageData[currentLanguage].errorSelectDistrict;
        errorMessage.style.color = 'red';
    } else {
        const total = parseInt(totalSpan.textContent.replace(/,/g, ''));
        errorMessage.textContent = `${languageData[currentLanguage].successOrder} ${total.toLocaleString()} frw`;
        errorMessage.style.color = 'green';
        
        // Clear cart after successful order
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
            updateCalculations();
            districtSelect.value = '0';
            errorMessage.textContent = '';
        }, 3000);
    }
});

// Language switching functionality
const languageSelect = document.getElementById('language-select');
let currentLanguage = 'en';

const languageData = {
    en: {
        title: 'Kigali Online Market',
        welcome: 'Welcome to Kigali Online Market',
        products: 'Our Products',
        cart: 'Cart',
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
    fr: {
        title: 'Marché en Ligne de Kigali',
        welcome: 'Bienvenue au Marché en Ligne de Kigali',
        products: 'Nos Produits',
        cart: 'Panier',
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
    rw: {
        title: 'Murengeza w\'Internet wa Kigali',
        welcome: 'Murakaza neza kuri Murengeza w\'Internet wa Kigali',
        products: 'Ibicuruzwa Byacu',
        cart: 'Akategori',
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

function updateLanguage(lang) {
    currentLanguage = lang;
    const data = languageData[lang];
    
    // Update page title and headings
    document.querySelector('h1').innerHTML = `🛒${data.title}`;
    document.querySelector('.darius').textContent = data.welcome;
    const headings = document.querySelectorAll('h2');
    if (headings[0]) headings[0].textContent = data.products;
    if (headings[1]) headings[1].textContent = data.cart;
    
    // Update button texts
    const addCartButtons = document.querySelectorAll('.productsBtn');
    addCartButtons.forEach(btn => {
        btn.textContent = data.addCart;
    });
    
    // Update remove buttons if they exist
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        const index = btn.getAttribute('data-index');
        btn.textContent = data.remove;
        btn.setAttribute('data-index', index);
    });
    
    // Update form labels
    const districtLabel = document.querySelector('label[for="district"]');
    if (districtLabel) districtLabel.textContent = `${data.selectDistrict} :`;
    
    if (applyButton) applyButton.textContent = data.applyNow;
    
    // Update district options
    const options = districtSelect.options;
    if (options[0]) options[0].textContent = data.noDistrict;
    if (options[1]) options[1].textContent = data.gasabo;
    if (options[2]) options[2].textContent = data.kicukiro;
    if (options[3]) options[3].textContent = data.busanza;
    if (options[4]) options[4].textContent = data.kagarama;
    
    // Update subtotal, shipping, total labels
    const subtotalText = document.querySelector('.cart p:first-of-type');
    if (subtotalText) subtotalText.innerHTML = `${data.subtotal}: <span id="subtotal">${subtotal.toLocaleString()}</span> frw`;
    
    const shippingText = document.querySelector('.cart p:nth-of-type(3)');
    if (shippingText) shippingText.innerHTML = `${data.shipping}: <span id="shipping">${shippingSpan.textContent}</span> frw`;
    
    const totalText = document.querySelector('.total');
    if (totalText) totalText.innerHTML = `${data.total}: <span id="total">${totalSpan.textContent}</span> frw`;
    
    // Update cart display to show translated text
    updateCartDisplay();
    
    // Update free shipping message if applicable
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingMsg.textContent = data.freeDelivery;
    }
}

// Event listener for language switcher
languageSelect.addEventListener('change', function() {
    updateLanguage(this.value);
});

// Initialize with English
updateLanguage('en');