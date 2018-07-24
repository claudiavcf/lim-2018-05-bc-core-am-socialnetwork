/*
Validaciones:

No pueden haber usuarios repetidos. (--)

Comportamiento:
La aplicación solo permitirá el acceso a usuarios con cuentas válidas.


Comportamiento:

Falta que se almacenen los likes en el database de firebase
Poder eliminar un post específico.
Al darle guardar debe cambiar de vuelta a un texto normal pero con la información editada.(ya
esta pero aumentar un tiempo para que se vea el cambio)
Al recargar la página debo de poder ver los textos editados


Front end
El corazón de este proyecto incluye:

Separar la manipulación del DOM de la lógica (separación de responsabilidades).

*/


'use strict';

const btnGoogle = document.getElementById("btnGoogle");
const btnFacebook = document.getElementById("btnFacebook");

const email = document.getElementById("email");
const password = document.getElementById("password");
const btnSignin = document.getElementById("btnSignin");

const btnLogout = document.getElementById("btnLogout");
const btnRegistro = document.getElementById("btnRegistro");


const bd = document.getElementById("bd");
const btnSave = document.getElementById("btnSave");

const posts = document.getElementById("posts");
const logout = document.getElementById("logout");

//const textarea = document.getElementById("textarea");
const post = document.getElementById("post");






window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            login.classList.remove("hiden");
            bd.classList.remove("hiden");
            posts.classList.remove("hiden");
            logout.classList.add("hiden");
            console.log('Inicio logueado');
            console.log(user);
            username.innerHTML = `Bienvenida  ${user.displayName}`;
            // photoURL.innerHTML =`<img src= user.photoURL.value>`;
            //"http://subirimagen.me/uploads/20180717121119.jpg"
            //https://graph.facebook.com/10209691428881959/picture
            //`${user.photoURL}`.appendChild(photoURL);
        } else {
            console.log('No está logueado')
            login.classList.add("hiden");
            logout.classList.remove("hiden");
            posts.classList.add("hiden");
            bd.classList.add("hiden");
        }
    });
}

btnRegistro.addEventListener('click', () => {

    // Registrar Usuario FIREBASE
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function () {
            console.log('Se creó el usuario')
        })
        .catch(function (error) {
            console.log(error.code, error.message)
        });
})

btnSignin.addEventListener('click', () => {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(function () {
            console.log('Inicia Sesion')
            var user = result.user;
            //writeUserData recibe parametros 
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch(function (error) {
            console.log(error.code, error.message)
        });
})

btnLogout.addEventListener('click', () => {
    firebase.auth().signOut().then(function () {
        console.log('Cerró sesión');
        login.classList.remove("hiden");
        logout.classList.add("hiden");
    })
        .catch(function (error) {
            console.log('Error al cerrar sesión');
        })
})

btnGoogle.addEventListener('click', () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log('Sesión con Google')
            var user = result.user;
            //writeUserData recibe parametros 
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        }).catch(function (error) {

            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);

        });

})

btnFacebook.addEventListener('click', () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log('Sesión con Facebook')
            var user = result.user;
            //writeUserData recibe parametros 
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);

        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);

        });

})


function writeUserData(userId, name, email, imageURL) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageURL,
    });
}

function writeNewPost(uid, body) {
    var postData = {
        uid: uid,
        body: body,
    };



    var newPostKey = firebase.database().ref().child('posts').push().key;


    var updates = {};
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

        //userId va a capturar los usuarios logueados
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        //console.log(userId + "    Usuario logueado");
        var userNom = firebase.auth().currentUser.displayName;

        //newpost ...al crear post me genera un key en firebase, retorna y asigno al usuario
        const newPost = writeNewPost(userId, post.value, userNom);
        //console.log(userNom);

        //imprimiendo en DOM
        //var logo = document.createElement("img");
        //logo.setAttribute("src", "http://subirimagen.me/uploads/20180717121119.jpg");

        addPost(newPost, post.value, userId, userNom);

        post.value = " ";

    }
})

function reload_page() {
    window.location.reload();
}

function addPost(newPost, post_value, userId, userNom) {
    console.log(newPost);
    console.log(post_value);
    console.log(userId);
    console.log(userNom);
    var nomUsuario = document.createElement("label");
    nomUsuario.setAttribute("for", "");
    nomUsuario.setAttribute("type", "label");

    var btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("value", "Modificar");
    btnUpdate.setAttribute("type", "button");


    var btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Eliminar");
    btnDelete.setAttribute("type", "button");

    var btnLike = document.createElement("input");
    btnLike.setAttribute("value", "Like");
    btnLike.setAttribute("type", "button");

    var cantLikes = document.createElement("label");
    cantLikes.setAttribute("for", "");
    cantLikes.setAttribute("type", "label");

    var contPost = document.createElement('div');
    //var textPost = document.createElement('p');


    var textPost = document.createElement('textarea');
    textPost.setAttribute("id", newPost);


    textPost.innerHTML = post_value;
    nomUsuario.innerHTML = userNom + "  publicó...";
    textPost.disabled = true;

    var contador = 0;

    btnLike.addEventListener('click', () => {

        if (userId = 0) {
            console.log("Debe estar logueado");
        }
        else {
            contador++;
            if (contador == 1) {
                cantLikes.innerText = contador;
            }
            else {
                alert("Solo puedes dar 1 like");
            }

        }
    });

    btnDelete.addEventListener('click', () => {

        /*
        EN MI DATABASE DE FIREBASE

        users: tiene h1XYr ... 
        es mi id -username claudia
        
        posts: solo tiene id de post 
        con el mensaje y el id de
        user-posts
        
        user-posts: tiene id de user-posts
        dentro está el id de post que muestra
        mi mensaje y id de user-posts*/


        if (window.confirm("¿Estás seguro de eliminar tu publicación?") == true) {

            //esto es en base de datos  
            firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
            firebase.database().ref().child('posts/' + newPost).remove();
            //DOM

            const dbRef = firebase.database().ref();
            const userPostsRef = dbRef.child('user-posts');


            userPostsRef.on("child_added", snap => {
                let userPost = snap.val();
                /*let $li = document.createElement("li");
                $li.innerHTML = user.name;
                $li.setAttribute("child-key", snap.key); 
                $li.addEventListener("click", userClicked)
                userListUI.append($li);*/
                console.log("USER POST:")
                console.log(userPost);

                //addPost(userPost, userPost.body, userPost.uid, userNom);

            });

            //elimina todos los posts solo en js
            while (posts.firstChild)
                posts.removeChild(posts.firstChild);

            alert('El usuario ha sido eliminado con éxito!');

        }
        else {
            alert("Se procedió a cancelar");
        }


    });


    btnUpdate.addEventListener('onclick', () => {

        textPost.disabled = false;

        btnUpdate.setAttribute("value", "Guardar");

      

        const newUpdate = document.getElementById(newPost);

        //alert("El post ha sido modificado correctamente");

        const nuevoPost = {

            body: newUpdate.value,
        };

        var updatesUser = {};
        var updatesPost = {};
        
        updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
        updatesPost['/posts/' + newPost] = nuevoPost;

        console.log(nuevoPost);


        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    })

    //contPost.appendChild(logo);
    contPost.appendChild(nomUsuario);
    contPost.appendChild(textPost);
    contPost.appendChild(btnUpdate);
    contPost.appendChild(btnDelete);
    contPost.appendChild(btnLike);
    contPost.appendChild(cantLikes);
    posts.appendChild(contPost);
}