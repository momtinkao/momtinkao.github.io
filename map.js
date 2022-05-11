var map;
var paths = [];
var marker;
var drivers = [];
var event_info = [];
const markers = [];
const infoWindows = [];
// Initialize and add the map
function initMap() {
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14.5,
    center: new google.maps.LatLng(23.89829068358121, 121.54178062110573),
  });
}

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

console.log("hello");

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
    document.getElementById("intro").style.display = "";
    document.getElementById("info").style.display = "none";
    document.getElementById("logout").style.visibility = "visible";
    $("#event_selector").css("display", "");
  } else {
    document.getElementById("intro").style.display = "none";
    document.getElementById("info").style.display = "";
    document.getElementById("logout").style.visibility = "hidden";
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
        addMap(doc.id);
      });
      i++;
    });
  });

function addMap(path) {
  DeleteMarkers();
  fb.collection("event")
    .doc(path)
    .collection("student")
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        markers.push(
          new google.maps.Marker({
            map: this.map,
            label: doc.id,
          })
        );
        infoWindows.push(new google.maps.InfoWindow({ disableAutoPan: true }));
      });
    });

  fb.collection("event")
    .doc(path)
    .collection("student")
    .onSnapshot((snap) => {
      for (let i = 0; i < snap.docs.length; i++) {
        var driver = snap.docs[i].data();
        markers[i].setPosition(new google.maps.LatLng(driver.lat, driver.lng));
        infoWindows[i].setContent(`<h2>${snap.docs[i].id}</h2>`);
        markers[i].addListener("click", function () {
          infoWindows[i].open(map, markers[i]);
        });
      }
    });
}

function DeleteMarkers() {
  //Loop through all the markers and remove
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
