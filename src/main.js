//login de usuario existente
const emaiLogin = document.getElementById('emaiLogin');
const passwordLogin = document.getElementById('passwordLogin');
const btnLogin = document.getElementById('btnLogin');
//Cerrar Sesion
const btnLogout = document.getElementById("btnLogout");
//Post
const bd = document.getElementById("bd");
const post = document.getElementById("post");
const btnSave = document.getElementById("btnSave");
const selector = document.getElementById("sel");
//Registro de usuario nuevo
const registerUser = document.getElementById("registerUser");
const btnGoogle = document.getElementById("btnGoogle");
const btnFacebook = document.getElementById("btnFacebook");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnUp = document.getElementById("btnUp");

//const textarea = document.getElementById("textarea");
expresionCorreo = /\w+@[a-z]+\.+[a-z]/;

window.onload = () => {


  const userId = null;
  const userNom = null;
  const newPost = writeNewPost(userId, post.value, userNom);
  const dbRef = firebase.database().ref();
  const userPostsRef = dbRef.child('user-posts');

  userPostsRef.on("child_added", snap => {
    snap.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val().mensaje;
      console.log("childData");
      console.log(childData);
      console.log("childKey");
      console.log(childKey);
      addPost(newPost, childData, userId, userNom);
    });
    //addPost(userPost, userPost.body, userPost.uid, userNom);
  });



  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      registerUser.classList.add("hiden");
      bd.classList.remove("hiden");
      posts.classList.remove("hiden");
      login.classList.remove("hiden");
      console.log('Inicio logueado');
      console.log(user);
      username.innerHTML = `Bienvenida  ${user.displayName}`;
      // photoURL.innerHTML =`<img src= user.photoURL.value>`;
      //"http://subirimagen.me/uploads/20180717121119.jpg"
      //https://graph.facebook.com/10209691428881959/picture
      //`${user.photoURL}`.appendChild(photoURL);
    } else {
      console.log('No está logueado');
      registerUser.classList.remove("hiden");
      login.classList.add("hiden");
      posts.classList.add("hiden");
      bd.classList.add("hiden");
    }
  });
}

//Registrar Usuario
btnUp.addEventListener('click', () => {
  if ((expresionCorreo.test(email.value))) {

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      .then((result, currentUser) => {
        currentUser.sendEmailVerification();
        firebase.auth().currentUser.sendEmailVerification();
        console.log("Se envió correo")
        console.log('Se creó el usuario')
        const user = result.user;
        //writeUserData recibe parametros 
        writeUserData(user.uid, user.displayName, user.email, user.photoURL);
      })
      .catch((error) => {
        console.log(error.code, error.message)
      });

    if (email.value == '' || password.value == '') {
      alert(' :( Por favor completa tu email y password para registrarte');
    }
  }
  else {
    alert('El correo electrónico no es valido');
  }
})
//Login de Usuario
btnLogin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(emaiLogin.value, passwordLogin.value)
    .then(() => {
      console.log('Inicia Sesion')
    })
    .catch((error) => {
      console.log(error.code, error.message)
    });

  if (emaiLogin.value == '' || passwordLogin.value == '') {
    alert(':( Por favor completa tu email y password para loguearte !!');
  }

  else if (!expresionCorreo.test(emaiLogin.value)) {
    alert('El correo electrónico no es valido');
  }
})
//Cerrar Sesión 
btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    console.log('Cerró sesión');
    login.classList.remove("hiden");
    registerUser.classList.add("hiden");
  })
    .catch((error) => {
      console.log('Error al cerrar sesión');
    })
})
//Login con Google
btnGoogle.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log('Sesión con Google')
      const user = result.user;
      //writeUserData recibe parametros 
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });
})
//Login con Facebook
btnFacebook.addEventListener('click', () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log('Sesión con Facebook')
      const user = result.user;
      //writeUserData recibe parametros 
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);

    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
    });
})

//creacion de database 
const writeUserData = (userId, name, email, imageURL) => {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageURL,
  });
}


//creación de nuevo post
const writeNewPost = (uid, mensaje) => {

  const postData = {
    uid: uid,
    mensaje: mensaje,
  };



  const newPostKey = firebase.database().ref().child('posts').push().key;
  // edita post
  const updates = {};
  //se almacenan posts
  updates['/posts/' + newPostKey] = postData;
  //se almacenan post por usuario
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  firebase.database().ref().update(updates);
  return newPostKey;


}


btnSave.addEventListener('click', () => {



  if (post.value.length == 0 || post.value == "") {
    alert("Debes publicar al menos un caracter");
  }
  else {

    if (selector = "Público") {

      btnSave.disabled = false;

      const userId = firebase.auth().currentUser.uid;
      console.log(userId + "    Usuario logueado capturado");
      const userNom = firebase.auth().currentUser.displayName;
      //newpost ...al crear post me genera un key en firebase, retorna y asigno al usuario
      const newPost = writeNewPost(userId, post.value, userNom);
      //imprimiendo en DOM
      //const logo = document.createElement("img");
      //logo.setAttribute("src", "http://subirimagen.me/uploads/20180717121119.jpg");
      addPost(newPost, post.value, userId, userNom);
      post.value = " ";




    }

    else {
      alert("se eligió opción privado");
    }
  }

});
