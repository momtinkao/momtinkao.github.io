var map;
var Markers = [];
function initMap() {
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14.5,
    center: new google.maps.LatLng(23.89829068358121, 121.54178062110573),
  });

  map.addListener("click", (e) => {
    placeMarker(e.latLng, map);
  });
}

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
firebase.initializeApp(firebaseConfig);

var i = 1;

$("#addevent").click(function () {
  var object = $("#event .mb-3").eq(2).clone();
  var object2 = $("#event .mb-3").eq(3).clone();
  var last = $("#event .mb-3").last();
  object.find("label").text(`地點${i}位置:`);
  object2.find("label").text(`地點${i}名稱:`);
  object.find("input").attr("id", `loc${i}`);
  object2.find("input").attr("id", `loc${i}_name`);
  object2.find("input").attr("data-target", "true");
  object2.find("input").attr("data-target-name", `loc${i}`);
  object.find("input").val("");
  object2.find("input").val("");
  object.appendTo(last);
  object2.appendTo(last);
  i += 1;
});

$("#deleteevent").click(function () {
  var object = $("#event .mb-3").last();
  var object2 = object.prev();
  if (object.find("input").attr("id") != "endname") {
    object.remove();
    object2.remove();
    i = i - 1;
    Markers[Markers.length - 1].setMap(null);
    Markers.pop();
    id.pop();
    now = 0;
  }
});

function placeMarker(location, map) {
  if (Markers[id.findIndex((x) => x.attr("id") === now.attr("id"))]) {
    Markers[id.findIndex((x) => x.attr("id") === now.attr("id"))].setPosition(
      location
    );
    now.val(location);
  } else {
    var marker_id = id.findIndex((x) => x.attr("id") === now.attr("id"));
    var marker = new google.maps.Marker({
      position: location,
      label: now.attr("id"),
      animation: google.maps.Animation.DROP,
      draggable: true,
      map: map,
    });
    Markers.push(marker);
    Markers[marker_id].addListener("drag", () => {
      id[marker_id].val(Markers[marker_id].getPosition());
    });
    map.panTo(location);
    now.val(location);
  }
}

var id = [];
var now;
$("#event").on("click", "[data-loc = 'true']", function () {
  now = $(this);
  if (id.findIndex((x) => x.attr("id") === now.attr("id")) === -1) {
    id.push($(now));
  }
});

var fb = firebase.firestore();

yourForm = document.querySelector(".needs-validation");

$("#submit_form").click(function (event) {
  if (!yourForm.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  } else if (yourForm.checkValidity()) {
    var event_name = $("#event_name").val();
    fb.collection("event").doc(`${event_name}`).set({});
    $("form input").each(function () {
      var temp;
      if ($(this).attr("data-time") == "true") {
        fb.collection("event")
          .doc(`${event_name}`)
          .update({
            time: $(this).val(),
          });
      } else if ($(this).attr("data-name") == "true") {
        fb.collection("event")
          .doc(`${event_name}`)
          .update({
            name: $(this).val(),
          });
      } else if ($(this).attr("data-target") == "true") {
        fb.collection("event")
          .doc(`${event_name}`)
          .collection("location")
          .doc($(this).attr("data-target-name"))
          .update({
            name: $(this).val(),
          });
      } else {
        temp = $(this).attr("id");
        fb.collection("event")
          .doc(`${event_name}`)
          .collection("location")
          .doc($(this).attr("id"))
          .set({
            loc: $(this).val(),
          });
      }
    });
    setTimeout(function () {
      $("form").submit();
    }, 1500);
  }
  $("form").addClass("was-validated");
});

var td = new tempusDominus.TempusDominus(
  document.getElementById("start_time"),
  {
    //put your config here
  }
);
