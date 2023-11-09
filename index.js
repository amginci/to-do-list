import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js" // functions imported from firebase

const appSettings = {
    databaseURL: "https://realtime-database-40bcf-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings) // info found in firebase
const database = getDatabase(app)  // info found in firebase
const toDoListInDB = ref(database, "toDoList") // info found in firebase

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const toDoListEl = document.getElementById("todo-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(toDoListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(toDoListInDB, function(snapshot) {
    if (snapshot.exists()) { // default is true - ()
        let itemsArray = Object.entries(snapshot.val())
    
        clearToDoListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemTotoDoListEl(currentItem)
        }    
    } else {
        toDoListEl.innerHTML = "No tasks added"
    }
})

function clearToDoListEl() { // refactor elements to functions everytime they could be used at another location too
    toDoListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemTotoDoListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li") // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `toDoList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    toDoListEl.append(newEl)
}