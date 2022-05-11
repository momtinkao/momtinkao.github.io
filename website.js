const firebaseConfig = {
  apiKey: "AIzaSyC9N97lBo2WFijKW6DouK8VNWkcYAKEa98",
  authDomain: "orientation-5be24.firebaseapp.com",
  databaseURL: "https://orientation-5be24-default-rtdb.firebaseio.com",
  projectId: "orientation-5be24",
  storageBucket: "orientation-5be24.appspot.com",
  messagingSenderId: "296265782220",
  appId: "1:296265782220:web:6e7f32a0877e51df6a8369",
  measurementId: "G-LWB7VLCXY8",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log(app);






  const fb = firebase.firestore();

  const commit_login_bt = document.getElementById("login_btn");
  const logout_btn = document.getElementById("logout");

  if (commit_login_bt) {
    commit_login_bt.addEventListener("click", (e) => {
      var login_email = document.getElementById("login_email").value;
      var login_password = document.getElementById("login_password").value;
      console.log("login");
      firebase
        .auth()
        .signInWithEmailAndPassword(login_email, login_password)
        .then((userCredential) => {})
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          document.getElementById("errorcode").textContent = errorMessage;
        });
    });
  }

  logout_btn.addEventListener("click", (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      document.getElementById("intro").style.display = "none";
      document.getElementById("info").style.display = "";
      document.getElementById("logout").style.visibility = "visible";
      document.getElementById("event").style.display = "";
      $("#exampleModal2").modal("hide");
      $("#event").css("display", "");
      $(".modal-backdrop").remove();

      // ...
    } else {
      document.getElementById("intro").style.display = "";
      document.getElementById("info").style.display = "none";
      document.getElementById("logout").style.visibility = "hidden";
      document.getElementById("event").style.display = "none";
      $("#event").css("display", "none");
    }
  });

  var flag = 0;
  $(" .card").css("display", "none");
  if (flag == 0) {
    var global_object = $("#info .row").eq(0).clone();
    flag++;
  }
  global_object.find(" .card").css("display", "");

  fb.collection("event").onSnapshot((querySnapshot) => {
    $("#info .container").empty();
    last = $("#info").last();
    querySnapshot.forEach((doc) => {
      var object = global_object.clone();
      var last = $("#info .container").last();
      object.find("h5").text("活動名稱: " + doc.data().name);
      object.find("p").text("開始時間:" + doc.data().time);
      object.find(".btn-primary").attr("data-id", doc.id);
      object.find(".btn-primary").attr("data-true", "true");
      object.find(".btn-outline-success").attr("data-QR", doc.id);
      object.find(".btn-outline-success").attr("data-QR-true", "true");
      object.appendTo(last);
    });
  });

  $("#info").on("click", "[data-true = 'true']", function () {
    sessionStorage.removeItem("id");
    sessionStorage.setItem("id", $(this).attr("data-id"));
    window.open("adjust.html", (config = "height=500,width=500"));
  });

  $("#info").on("click", "[data-QR-true = 'true']", function () {
    sessionStorage.removeItem("QRid");
    sessionStorage.setItem("QRid", $(this).attr("data-QR"));
    window.open("QRcode.html", (config = "height=500,width=500"));
  });

