function log(value){
    console.log(value);
}

/////////////////////////////////////////////////
// Firebase Config
/////////////////////////////////////////////////


var config = {
    apiKey: "AIzaSyCE3OKEAmCXKDHu2RVCPwLbn6CD1cgmkOk",
    authDomain: "kings-cross-train-scheduler.firebaseapp.com",
    databaseURL: "https://kings-cross-train-scheduler.firebaseio.com",
    projectId: "kings-cross-train-scheduler",
    storageBucket: "",
    messagingSenderId: "690907265943"
};

// Configures a database using the config object values
firebase.initializeApp(config);

// Creates the database and assigns to variable
var database = firebase.database();

// Changes the database reference to the connections directory
// var connectionRef = database.ref("/connections");

// // Changes the database reference to the connected users directory
// var connectedRef = database.ref(".info/connected");

// // When the client's connection state changes...
// connectedRef.on("value", function(snap) {

//   // If they are connected..
//   if (snap.val()) {

//     // Add user to the connections list.
//     var con = connectionsRef.push(true);
//     // Remove user from the connection list when they disconnect.
//     con.onDisconnect().remove();
//   }
// });

// // When first loaded or when the connections list changes...
// connectionsRef.on("value", function(snap) {

//   // Display the viewer count in the html.
//   // The number of online users is the number of children in the connections list.
//   $("#connected-viewers").html(snap.numChildren());
// });

/////////////////////////////////////////////////
// Initial Values
/////////////////////////////////////////////////

var trainName = "";
var trainDest = "";
var trainArrive = "";
var trainFreq = "";

/////////////////////////////////////////////////
// Database Calls
/////////////////////////////////////////////////


database.ref().on("child_added", function(snapshot){
    log("Database Value Changed");
    if (snapshot.child("trainName").exists){
// Do I need to do a for loop for entries here?
        trainName = snapshot.val().trainName;
        trainDest = snapshot.val().trainDest;
        trainArrive = snapshot.val().trainArrive;
        trainFreq = snapshot.val().trainFreq;
        log("Child exists in database");
    } // end if
    else{
        log("Child does not exist in database");
    } // end else

    
    
// sandbox
    var remainder = moment().diff(moment.unix(trainArrive), "minutes") % trainFreq ;
    var minutes = trainFreq - remainder;
    console.log(remainder);
    var arrival = moment().add(minutes, "m").format("hh:mm A");

    $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");

}); // end database value change

// Whenever a user submits a train schedule
$("#trainSubmit").on("click", function(event){
    event.preventDefault();

    // Get Users Input
    var trainNameInput = $("#trainInput").val().trim();
    var trainDestInput = $("#destInput").val().trim();
    var trainArriveInput = moment($("#arriveInput").val().trim(), "HH:mm").format("X");
    var trainFreqInput = $("#freqInput").val().trim();
    // Validate User Input
    // Check if any of the inputs are blank
    if(trainNameInput === "" ){
        alert("Please put a Train Name in.");
        return;
    }else{
        trainName = trainNameInput;
    }
    if(trainDestInput === "" ){
        alert("Please put a Train Destination in.");
        return;
    }else{
        trainDest = trainDestInput;
    }
    if(trainArriveInput === "" ){
        alert("Please put a Train Arrival Time in.");
        return;
    }else{
// Add more Validation to verify that the input was in military time and correct
        trainArrive = trainArriveInput;
    }
    if(trainFreqInput === "" ){
        alert("Please put a Train Frequency in.");
        return;
    }else{
        trainFreq = trainFreqInput;
    }
    // end Validation on User Inputs
    log("User submitted a new train schedule.")

    log("----------Users Inputs being sent to database----------");
    log("Train Name: " + trainNameInput);
    log("Train Destination: " + trainDestInput);
    log("Train Arrival: " + trainArriveInput);
    log("Train Frequency: " + trainFreqInput);

    log(event);
    
    // Send to Database

    database.ref().push({
        trainName: trainName,
        trainDest: trainDest,
        trainArrive: trainArrive,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }); 
});// end Submit onClick

$("#trainReset").on("click", function(){
	log("User reset the inputs")
    $("#trainInput").val("");
    $("#destInput").val("");
    $("#arriveInput").val("");
    $("#freqInput").val("");

})// end Reset onClick

setTime