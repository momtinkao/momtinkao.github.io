var event_info = [];

var firebaseConfig = {
  apiKey: "AIzaSyC9N97lBo2WFijKW6DouK8VNWkcYAKEa98",
  authDomain: "orientation-5be24.firebaseapp.com",
  databaseURL: "https://orientation-5be24-default-rtdb.firebaseio.com",
  projectId: "orientation-5be24",
  storageBucket: "orientation-5be24.appspot.com",
  messagingSenderId: "296265782220",
  appId: "1:296265782220:web:6e7f32a0877e51df6a8369",
  measurementId: "G-LWB7VLCXY8",
};

firebase.initializeApp(firebaseConfig);
var fb = firebase.firestore();

const logout_btn = document.getElementById("logout");

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
    console.log("hello");
    $("#intro").css("display", "");
    $("#info").css("display", "none");
    $("#logout").css("visibility", "visible");
    $("#event_selector").css("display", "");
  } else {
    $("#intro").css("display", "none");
    $("#info").css("display", "");
    $("#logout").css("visibility", "hidden");
    $("#event_selector").css("display", "none");
  }
});

fb.collection("event")
  .get()
  .then((querySnapshot) => {
    var i = 0;
    querySnapshot.forEach((doc) => {
      event_info[i] = doc.data();
      $(".dropdown-menu").append(
        `<li><button class="dropdown-item" type="button" id="info${i}">${
          doc.data().name
        }</button></li>`
      );
      $(`#info${i}`).on("click", function () {
        $("#dropdownMenu2").text(doc.data().name);
        $("#rankmap").empty();
        addTable(doc.id);
      });
      i++;
    });
  });

function addTable(path) {
  fb.collection("event")
    .doc(path)
    .collection("student")
    .where("time", "!=", null)
    .onSnapshot((querySnapshot) => {
      $("#rankmap").empty();
      console.log(querySnapshot);
      var map = new Map();
      querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data().time);
      });
      const mapSort2 = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
      var i = 1;
      for (let [key, value] of mapSort2) {
        console.log(`name:${key}, time:${value}`);
        $("#rankmap").append(`<tr class="table-secondary">
          <th scope="row">${i}</th>
          <td>${key}</td>
          <td>${value}</td>
        </tr>`);
        i++;
      }
    });
}
