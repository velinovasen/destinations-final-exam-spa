function init_loader() {
    navigate('home')
}

init_loader()

window.addEventListener('popstate', (e) => {
    router(location.pathname.slice(1))  
})


const DOMSelectors = {
    destinationInput: () => document.getElementById('destination'),                               // most likely this will be the input fields from the form
    cityInput: () => document.getElementById('city'),
    durationInput: () => document.getElementById('duration'),
    departureDateInput: () => document.getElementById('departureDate'),
    imgUrlInput: () => document.getElementById('imgUrl'),
 
}


// NAVBAR BUTTONS 

function createNewItem(event) {                        //this is the ADD button in the NAVBAR
    event.preventDefault()

    navigate(event.target.href)
}

function homeButton(event) {
    event.preventDefault()

    navigate(event.target.href)
}

function logoutButton(event) {
    event.preventDefault()

    localStorage.removeItem('auth')
    setTimeout(function(){navigate('login')}, 700)
}
// LOGIN AND REGISTER BUTTONS

function registerNowButton(event) {      // register button click, redirect to register template
    event.preventDefault()

    console.log(event.target.href)

    navigate(event.target.href)
}

function loginNowButton(event) {
    event.preventDefault()

    console.log(event.target.href)

    navigate(event.target.href)
}

async function loginSubmitButton(event) {
    event.preventDefault()

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    document.getElementById('error-login-form').style.display = 'none'
    document.getElementById('loading-bar').style.display = 'block';
    await authServices.loginUser(email, password)
    if(Boolean(localStorage.getItem('auth'))) {
        setTimeout(function() {
            navigate('home')
            document.getElementById('error-login-form').style.display = 'none'
            document.getElementById('loading-bar').style.display = 'none'
        }, 700)
    } else {
        document.getElementById('loading-bar').style.display = 'none'
        document.getElementById('error-login-form').style.display = 'block'
    }
    
}

function registerSubmitButton(event) {
    event.preventDefault()

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('rePassword').value;
    
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
        document.getElementById('reg-error-box').style.display = 'block';
        document.getElementById('reg-error-box').innerText = 'Enter correct email and try again.'
        return;
    }

    if (!email || !password || !password2) {
        document.getElementById('reg-error-box').style.display = 'block';
        document.getElementById('reg-error-box').innerText = 'You have an empty field.'
        return;
    }
    if (password.length < 6 || password !== password2) {
        document.getElementById('reg-error-box').innerText = 'Password must be at least 6 characters or passwords does not match';
        document.getElementById('reg-error-box').style.display = 'block';
        return;
    }
    
    const data = authServices.registerUser(email, password);
    document.getElementById('reg-error-box').style.display = 'none';
    setTimeout(function() {navigate('home')}, 1200);
  
}

// ITEMS BUTTONS

function deleteItem(event) {
    event.preventDefault()
    const id = event.target.id;

    document.getElementById('loading-bar').style.display = 'block';
    itemServices.deleteItemFetch(id)
    console.log('DELETED');
    setTimeout(function() {
        document.getElementById('loading-bar').style.display = 'none';
        document.getElementById('success-delete-form').style.display = 'block';
        setTimeout(function() {document.getElementById('success-delete-form').style.display = 'none';})
        navigate('/destinations') 
    }, 1100)
}

async function editItemButtonSubmit(event) {
    event.preventDefault()
    const id = event.target.id                                                       // will need to adjust this 
    const destination = DOMSelectors.destinationInput().value;                            
    const city = DOMSelectors.cityInput().value;
    const duration = DOMSelectors.durationInput().value;
    const departureDate = DOMSelectors.departureDateInput().value;
    const imgUrl = DOMSelectors.imgUrlInput().value;

    const isOk = correctInputChecker(destination, city, duration, departureDate, imgUrl);

    if (isOk) {
    console.log(id, destination, city, duration, departureDate, imgUrl);
        document.getElementById('error-edit-form').style.display = 'none'
        document.getElementById('success-edit-form').style.display = 'block';    
        itemServices.editItemFetch(id, {destination, city, duration, departureDate, imgUrl})
    
        setTimeout(function() { 
            navigate('/details/' + id) 
            document.getElementById('success-edit-form').style.display = 'none';
        }, 1100)
    } else {
        document.getElementById('error-edit-form').style.display = 'block'
    }

}

function editItem(event) {                      //edit item button 
    event.preventDefault()

    navigate('/edit/' + event.target.id);
}


function detailsButton(event) {                          // details button
    event.preventDefault()

    navigate('/details/' + event.target.parentElement.id)
}

function createButton(event) {                      // create item button
    event.preventDefault()

    const destination = DOMSelectors.destinationInput().value;                            
    const city = DOMSelectors.cityInput().value;
    const duration = DOMSelectors.durationInput().value;
    const departureDate = DOMSelectors.departureDateInput().value;
    const imgUrl = DOMSelectors.imgUrlInput().value;

    const validator = correctInputChecker(destination, city, duration, departureDate, imgUrl);
    
    if (!validator) {
        document.getElementById('error-create-form').style.display = 'block';
        return;
    }
    itemServices.createOffer(destination, city, duration, departureDate, imgUrl)
    
    document.getElementById('error-create-form').style.display = 'none';
    document.getElementById('success-create-form').style.display = 'block';

    console.log(destination, city, duration, departureDate, imgUrl)

    setTimeout(function() {
        navigate('home')
        DOMSelectors.destinationInput().value = '';           
        DOMSelectors.cityInput().value = '';
        DOMSelectors.durationInput().value = '';
        DOMSelectors.departureDateInput().value = '';
        DOMSelectors.imgUrlInput().value = '';
        document.getElementById('success-create-form').style.display = 'none';
    }, 1200)

}

async function myDestinations(event) {
    event.preventDefault()

    navigate(event.target.href)
}

// correct input form checker

function correctInputChecker(destination, city, duration, departureDate, imgUrl){

    let isOk = true;

    if (!/[A-z]+$/.test(destination)) {
        isOk = false;
        return isOk;
    }
    if (!/[A-z]+$/.test(city)) {
        isOk = false;
        return isOk;
    }
    if (Number(duration) < 1 || Number(duration) > 100) {
        isOk = false;
        return isOk;
    }
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(imgUrl)) {
        isOk = false;
        return isOk;
    }

    return isOk;
    

}