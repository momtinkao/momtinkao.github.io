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

const infoWindows = [];
var poly;
var pathOne;
var map;
var markers = [];
function initMap() {
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14.5,
    center: new google.maps.LatLng(23.89829068358121, 121.54178062110573),
  });
  const lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  };
  poly = new google.maps.Polyline({
    map: map,
    geodesic: true,
    icons: [
      {
        icon: lineSymbol,
        offset: "100%",
      },
    ],
  });
}
var flag = 0;
$(" .card").css("display", "none");
if (flag == 0) {
  var global_object = $("#info .row").eq(0).clone();
  flag++;
}
global_object.find(" .card").css("display", "");

firebase.initializeApp(firebaseConfig);

$("#logout").click(function () {
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

//偵測是否登入
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    document.getElementById("intro").style.display = "none";
    document.getElementById("info").style.display = "";
    document.getElementById("logout").style.visibility = "visible";
    document.getElementById("event_selector").style.display = "";
    $("#exampleModal2").modal("hide");
    $("#map_info").css("display", "");
    $(".modal-backdrop").remove();

    // ...
  } else {
    document.getElementById("intro").style.display = "";
    document.getElementById("info").style.display = "none";
    document.getElementById("logout").style.visibility = "hidden";
    document.getElementById("event_selector").style.display = "none";
    $("#map_info").css("display", "none");
  }
});

var fb = firebase.firestore();

//選擇活動
fb.collection("event")
  .get()
  .then((querySnapshot) => {
    var i = 0;
    querySnapshot.forEach((doc) => {
      $(".dropdown-menu").append(
        `<li><button class="dropdown-item" type="button" id="info${i}">${
          doc.data().name
        }</button></li>`
      );
      $(`#info${i}`).on("click", function () {
        $("#dropdownMenu2").text(doc.data().name);
        $(" .card").css("display", "");
        addStudent(doc.id);
      });
      i++;
    });
  });

//選擇活動後顯示學生
function addStudent(path) {
  $("#info").empty();
  fb.collection("event")
    .doc(path)
    .collection("student")
    .onSnapshot((querySnapshot) => {
      $("#info").empty();
      querySnapshot.forEach((doc) => {
        last = $("#info").last();
        var object = global_object.clone();
        object.find("h5").text("學生名稱: " + doc.id);
        object.find(".btn-primary").attr("data-id", doc.id);
        object.find(".btn-primary").attr("data-path", path);
        object.find(".btn-primary").attr("data-true", "true");
        if (doc.data().path) {
          object.find("p").text("已打卡數量:" + doc.data().path.length);
        } else {
          object.find("p").text("還沒開始活動");
        }
        object.appendTo(last);
      });
    });
}

$("#info").on("click", "[data-true = 'true']", function () {
  addMap($(this).attr("data-path"), $(this).attr("data-id"));
});

function addMap(path, id) {
  fb.collection("event")
    .doc(path)
    .collection("location")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var location = getLatLngFromString(doc.data().loc);
        var marker = new google.maps.Marker({
          position: location,
          label: doc.id,
          map: map,
        });
        markers.push(marker);
      });
    })
    .then(function () {
      var icon = {
        url: "pictures/placeholder.png",
        scaledSize: new google.maps.Size(40, 40),
      };
      fb.collection("event")
        .doc(path)
        .collection("student")
        .doc(id)
        .onSnapshot((doc) => {
          poly.getPath().clear();
          for (let i = 0; i < doc.data().path.length; i++) {
            var location = getLatLngFromString(doc.data().path[i]);
            if (i == 0) {
              new google.maps.Marker({
                map: this.map,
                position: getLatLngFromString(doc.data().path[i]),
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "FFFFFF",
                  fillOpacity: 1,
                  strokeColor: "#00FF00",
                  scale: 6,
                },
              });
            }
            var now = markers.findIndex(
              (x) =>
                x.getPosition().lat() === location.lat() &&
                x.getPosition().lng() === location.lng()
            );
            if (now != -1) {
              markers[now].setIcon(icon);
            }
            var pathOne = poly.getPath();
            pathOne.push(getLatLngFromString(doc.data().path[i]));
          }
        });
    });
}

function getLatLngFromString(ll) {
  ll = ll.replace("(", "");
  ll = ll.replace(")", "");
  var latlng = ll.split(",");
  return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
}
