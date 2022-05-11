var path = sessionStorage.getItem("QRid");

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

firebase.initializeApp(firebaseConfig);
var fb = firebase.firestore();
var flag = 0;
if (flag == 0) {
  var global_object = $(" .container .row").eq(0).clone();
  var global_object2 = $(" .container .row").eq(1).clone();
  flag++;
}

fb.collection("event")
  .doc(path)
  .collection("location")
  .get()
  .then((querySnapshot) => {
    $(" .container").empty();
    querySnapshot.forEach((doc) => {
      console.log("1");
      var object = global_object.clone();
      var object2 = global_object2.clone();
      var last = $(" .container").last();
      object.find("label").text(doc.data().name);
      object2
        .find("div[data-qr = 'true']")
        .qrcode({
          width: 256,
          height: 256,
          text: doc.id + "/" + doc.data().loc,
        });
      object.appendTo(last);
      object2.appendTo(last);
    });
  });

$("button").click(function(){
  var pdf = new jsPDF('', 'pt', 'a4');
  for(let i = 0; i<$("label").length ; i++){
      pdf.text($("label")[i].text(), 10, 20);
      pdf.addImage($("canvas")[i].toDataURL("image/png"), 'PNG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );
      pdf.addPage();
}
  pdf.save("QRcode.pdf");
});
