const apiKey = `AIzaSyDxsDbbJM-Sd0gaxpe8NCX6AXNH43VEmM4`;

const authServices = {
    async registerUser(email, password) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()
        await this.loginUser(email, password)
        return data;
        
    },

    async loginUser(email, password) {

        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({email, password})}
        )
        
        const user = await response.json()
        if (!user.error) {
            localStorage.setItem('auth', JSON.stringify(user))
        }
        return user;

    }
}


const itemServices = {

    async createOffer(destination, city, duration, departureDate, imgUrl){           // adjust here 

        const creatorId = JSON.parse(localStorage.getItem('auth')).localId;        //get the creator of the item if we need it

        const response = await fetch(databaseURL + '.json', {
            method: "POST",
            body: JSON.stringify({
                destination,
                city,                                                  // most likely we need to adjust this
                duration,
                departureDate,
                imgUrl,
                creatorId,
            })
        })
        const data = await response.json()
    },

    async getOffers() {                                    // we may not need this at all since we have it in the router file
        
        const response = await fetch(databaseURL + '.json') 

        const data = await response.json()

        return data;
    },

    async buyItem(id, buyer) {                             // buy the item 
        let shoe = await getItemDetails(id);
        let clients = shoe.clients.emails;                  // get the current people that already have it (if we need it)
        let bought = Number(shoe.bought) + 1;               // keep the count of how many people own it
        clients = clients.slice(0, -1)                      // cut the bracket since for now clients is a STRING, which means we only do concatenation
        clients += buyer + ", ]";       
        
        const response = await fetch(databaseURL + id + '.json', {        // add the buyer and the count to the item in the database
            method: "PATCH",
            body: JSON.stringify({
                'clients': {'emails': clients},
                'bought': bought
            })
        })

    },

    async editItemFetch(id, shoe) {                                        // edit the item (validations are done in the init.js file)
        const response = await fetch(databaseURL + id + '.json', {
            method: "PATCH",
            body: JSON.stringify(shoe)
        })
        
       
    },

    async deleteItemFetch(id) {                                            // delete the item
        const response = await fetch(databaseURL + id + '.json', {
            method: "DELETE"
        })
    }



}