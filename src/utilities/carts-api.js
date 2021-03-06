import sendRequest from "./send-request";
import { updateGame } from "./games-api";
import * as usersService from "./users-service";

const BASE_URL = '/api/carts'

// Gets cart from database
export async function getCart(userId){
    if(!userId) return getSessionCart()
    try{
        return await sendRequest(`${BASE_URL}?user=${userId}`)
    } catch(err) {
        console.log(`${err} in utitilies`)
    }
}

// Gets cart from session storage
function getSessionCart(){
    return JSON.parse(sessionStorage.getItem('cart'))
}


// Compares cart in the database with storage cart for any repeated games
function compareCarts(dtbsCart, strgCart){
    const userId = strgCart[0].user
    // user had a cart before logging in and also had a cart in the system
    if(dtbsCart.length > 0){
        for(let i = 0; i <dtbsCart.length; i++){
            const foundCart = strgCart.find((obj) => obj.games[0]._id === dtbsCart[i].games[0]._id)
            if(foundCart){
                updateCart(dtbsCart[i], foundCart.games.length)
                delete foundCart.user
            }
        }
    }
    for(let i = 0; i < strgCart.length; i++){
        createCart(strgCart[i])
    }
    return getCart(userId)
}


// Creates Schema if there is a user or adds to storage if there isn't one
async function createCart(payload){
    if(!payload.user){
        payload.quantity = payload.games.length
        payload._id = payload.games[0]._id
        const cart = getSessionCart()
        return sessionStorage.setItem('cart', JSON.stringify([...cart, payload]))  
    } 
    try{
        return await sendRequest(`${BASE_URL}`, 'POST', payload)
    } catch(err) {
        console.log(`${err} in utitilies`)
    }
}

// Checks if cart of a particular game already exists
async function findCart(payload){
    // if there's a user logged in
    if(payload.user){
        const cart = await getCart(payload.user)
        const foundCart = cart.find((obj) => payload.games[0]._id === obj.games[0]._id)
        return foundCart ? foundCart : null
    // no user loged in
    } else {
        const cart = getSessionCart()
        const foundCart = cart.find((obj) => payload.games[0]._id === obj.games[0]._id)
        return foundCart ? foundCart : null
    }
}

// Creates cart schema (only if there's a user) and adds it to storage
export async function addToCart(payload){
    const cartItem = await findCart(payload)
    if(!cartItem) return await createCart(payload)
    return await updateCart(cartItem, 1)
}


// Updates cart in database
export async function updateCart(payload, num){
    // if there's a user logged in
    if(payload.user){
        for(let i = 1; i <= num; i++){
            payload.games = [...payload.games, payload.games[0]]
        }
        payload.quantity = payload.games.length
        return await sendRequest(BASE_URL, 'PUT', payload)
    // no user loged in
    } else {
        const cart = getSessionCart()
        const cartItem = cart.find((obj) => obj._id === payload._id)
        cartItem.games = [...cartItem.games, payload.games[0]]
        cartItem.quantity = cartItem.games.length
        return sessionStorage.setItem('cart', JSON.stringify(cart))
    }
}


// Checks if cart in storage is empty when logging in
export async function checkCart(userId){
    const ssnCart = getSessionCart()
    const dtbsCart = await getCart(userId)
    // if there isn't a user signed in already (not a page refresh)
    if(ssnCart.length > 0){
        ssnCart.forEach((cartItem) => {
            cartItem.user = userId
            delete cartItem._id
        })
        return compareCarts(dtbsCart, ssnCart)
    } 
}


// Deletes cart schema or item from session storage
export async function deleteCart(id, idx){
    if(idx === undefined){
        try{
            return await sendRequest(`${BASE_URL}/${id}`, "DELETE")
        } catch(err) {
            console.log(`${err} in utitilies`)
            return
        } 
    } else {
        const cart = getSessionCart()
        cart.splice(idx, 1)
        return sessionStorage.setItem('cart', JSON.stringify(cart))
    }
}


// Buys cart game
export async function buyCart(payload, idx){
    const gamePayload = payload.games[0]
    gamePayload.qty -= payload.quantity
    gamePayload.sold += payload.quantity
    await updateGame(gamePayload._id, gamePayload)
    if(payload.user){
        // add current game to the user's bought array and deletes the game from cart
        const userInfo = await usersService.getUser()
        userInfo.bought = [...userInfo.bought, gamePayload._id]
        await usersService.editUser(userInfo)
        await deleteCart(payload._id)
    }else {
        const cart = getSessionCart()
        cart.splice(idx, 1)
        return sessionStorage.setItem('cart', JSON.stringify(cart))
    }
}


export async function changeCart(payload, idx, num){
    const newArr = []
    for (let i = 1; i <= num; i++){
        newArr.push(payload.games[0])
    }
    payload.games = newArr
    payload.quantity = newArr.length
    if(payload.user){
        try{
            return await sendRequest(BASE_URL, 'PUT', payload)
        } catch(err) {
            console.log(`${err} in utitilies`)
            return
        } 
    } else {
        const cart = getSessionCart()
        cart.splice(idx, 1, payload)
        return sessionStorage.setItem('cart', JSON.stringify(cart))
    }
}
