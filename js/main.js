/////////////////// FIREBASE CONFIG //////////////////////

// Project settings
let config = {
  apiKey: 'AIzaSyBg4YKpUQIyLeR_luhcmoJnRZWH65sD5oU',
  authDomain: 'wmdd-b6d1f.firebaseapp.com',
  databaseURL: 'https://wmdd-b6d1f.firebaseio.com',
  projectId: 'wmdd-b6d1f',
  storageBucket: 'wmdd-b6d1f.appspot.com',
  messagingSenderId: '549717994968',
  appId: '1:549717994968:web:fe2471d22da07c8c0e56ad',
  measurementId: 'G-17FJL464CX',
}

//Initialize firebase with your project config
firebase.initializeApp(config)

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore()

//////////////// VARIABLES DECLARATION ////////////////////

let email = document.getElementById('email').value
let password = document.getElementById('password').value
let signUp = document.getElementById('sign-up')
let signIn = document.getElementById('sign-in')
let signOut = document.getElementById('sign-out')
let addButton = document.getElementById('addBtn')

////////////////// EVENT LISTENERS //////////////////////

signUp.addEventListener('click', sUp)
signIn.addEventListener('click', sIn)
signOut.addEventListener('click', sOut)
addButton.addEventListener('click', addTodo)
$(document).on('click', '.btn-done', deleteReg)

//////////////// FUNCTIONS DECLARATIONS ////////////////

//sign-up function
function sUp() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      $('#msg').html('You account was created. Please Sign In')
    })
    .catch(function (error) {
      console.log(error.code)
      console.log(error.message)
      $('#msg').html(error.message)
    })
  //console.log(email);
}

// sign-in function
function sIn() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      $('#msg').html('You are logged-in')
      console.log('User logged-in')
      $('#todo').css('display', 'block')
      updateList()
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode)
      console.log(errorMessage)
      $('#msg').html(errorMessage)
    })
}

// sign-out function
function sOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
      $('#todo').css('display', 'none')
      $('#msg').html('You are logged-out')
      console.log('User Logged Out!')
    })
    .catch(function (error) {
      // An error happened.
      console.log(error)
    })
}

//get user state
function state() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $('#todo').css('display', 'block')
    } else {
      $('#todo').css('display', 'none')
    }
  })
}

//get details from user
function getDetails() {
  var user = firebase.auth().currentUser
  if (user) {
    // User is signed in.
    if (user != null) {
      name = user.displayName
      email = user.email
      photoUrl = user.photoURL
      emailVerified = user.emailVerified
      uid = user.uid
      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }
  } else {
    // No user is signed in.
  }
}

//do the adding part
function addTodo() {
  //alert("test");
  db.collection('mycollection')
    .add({
      name: $('#name').val(),
      date: $('#due').val(),
    })
    .then(function (doc) {
      console.log('Document written with ID: ', doc.id)
      updateList()
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
}

//listen to realtime update from DB

function updateList() {
  db.collection('mycollection').onSnapshot((querySnapshot) => {
    $('#list').html('')
    db.collection('mycollection')
      .orderBy('date')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          $('#list').append(`<li>ID: ${doc.id} | Name: ${doc.data().name} | 
              Date: ${doc.data().date}
              <button class="btn-done" data-task="${
                doc.id
              }" id="${doc.id}">Delete</button></li>`)
        })
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
      })
  })
}

//delete reg from DB
function deleteReg() {
  let docRef = this.id
  db.collection('mycollection')
    .doc(docRef)
    .delete()
    .then(function () {
      console.log('Document successfully deleted!')
    })
    .catch(function (error) {
      console.error('Error removing document: ', error)
    })
}
