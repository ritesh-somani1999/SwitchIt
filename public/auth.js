// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
      setupUI(user);
  } else {
    setupUI();
  }
})

// create new store
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
e.preventDefault();

var timestamp=JSON.stringify(Date.now());
db.collection('shop').doc(firebase.auth().currentUser.uid).set({
  name: createForm['storename'].value,
  panno: createForm['panno'].value,
  gstnno: createForm['gstnno'].value,
  address: createForm['address'].value,
  city: createForm['city'].value,
  pincode: createForm['pincode'].value,
  mobile: createForm['mobile'].value,
  email: createForm['email'].value,
  timestamp:timestamp,

 }).then(() => {
    db.collection('users').doc(firebase.auth().currentUser.uid).update({
    shop:true
    });
    location.reload();
    toggleModal();
  createForm.reset();
}).catch(err => {
  console.log(err.message);
});
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email sent.
      alert("Signup Successful !!!");
      console.log("sent");
    });
    db.collection('users').doc(cred.user.uid).set({
      name: signupForm['signup-name'].value,
      mobile: signupForm['signup-mobile'].value,
      address: signupForm['signup-address'].value,
      shop: false
    });
    auth.signOut().then(() => {
    // close the signup modal & reset form
    // location.reload();
    toggleModal();
    signupForm.reset();
  }).catch(err => {
    alert(err.message);
  });
});
});



// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
e.preventDefault();
auth.signOut().then(() => {
  window.location.replace("index.html");
  alert('Successfully, logged out !!!');
})
});


// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
e.preventDefault();

// get user info
const email = loginForm['login-email'].value;
const password = loginForm['login-password'].value;

// log the user in
auth.signInWithEmailAndPassword(email, password).then((user) => {
  if (!firebase.auth().currentUser.emailVerified)
  {
    auth.signOut();
    alert("Verify your email first and try logging in...");
  }
  toggleModal();
  loginForm.reset();
}).catch(err => {
  alert(err.message);
});

});


// reset password
function forpass(){
  var foremail = prompt("Please enter your email");
  if (foremail != null) {
    auth.sendPasswordResetEmail(foremail).then(function() {
      alert("Email reset mail has been sent to " + foremail + ". Check your inbox !!!");
    }).catch(function(error) {
      alert(error.message);
    });
  }
  else
  {
    alert("Enter a valid email !!!");
  }
}