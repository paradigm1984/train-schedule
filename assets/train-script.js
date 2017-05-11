$(document).ready(function() {

/* ========================= VARIABLES ======================== */

	// connecting firebase
	var config = {
	apiKey: "AIzaSyAR_hJ7iANmKITgI8BaskyQFgm54lAFwJM",
	authDomain: "train-schedules-df559.firebaseapp.com",
	databaseURL: "https://train-schedules-df559.firebaseio.com",
	projectId: "train-schedules-df559",
	storageBucket: "train-schedules-df559.appspot.com",
	messagingSenderId: "718340101865"
	};

	// initializing firebase
	firebase.initializeApp(config);

	// a variable to reference the database.
	var database = firebase.database();

	// initial variables
	var trainName = "";
	var destination = "";
	var firstTrainTime = "";
	var frequency = 0;
	// makes the current time into a variable
	var currentTime = moment();

/* ========================= FUNCTIONS ======================== */
	
	
	$("#currentTime").text(currentTime);
	
	// on click, the varialbes initially set to nothing or 0 will be set
	// to the values that were entered
	$("#addTrain").on("click", function() {

		trainName = $("#trainName").val().trim();
		destination = $("#destination").val().trim();
		firstTrainTime = $("#firstTrainTime").val().trim();
		frequency = $("#frequency").val().trim();

		// console.log(trainName);
		// console.log(destination);
		// console.log(firstTrainTime);
		// console.log(frequency);

		// pushes the input values to firebase
		database.ref().push({

			trainName: trainName,
		    destination: destination,
		    firstTrainTime: firstTrainTime,
		    frequency: frequency
		})


		// clears all of the text boxes
		$("#trainName").val("");
		$("#destination").val("");
		$("#firstTrainTime").val("");
		$("#frequency").val("");

		// so the page doesnt refresh on submit
		return false;

	});



	// grabbing the input from the database to then display it
	// in the table. this is triggered when a new input is entered
	database.ref().on("child_added", function(snapshot) {

		// array of initial variables as well as some later added. had to put it here cause scope
		var trainDataArray = [ trainName, destination, frequency, firstTrainTime, nextTrain, nextTrainConverted];

		// console.log(snapshot.val());

		// updates the variable with data from the database
		trainName = snapshot.val().trainName;
		destination = snapshot.val().destination;
		firstTrainTime = snapshot.val().firstTrainTime;
		frequency = snapshot.val().frequency;

		// gives the current time but pushes it back a year so its 
		// before the current time. 
		var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

		// console.log(firstTimeConverted);

		// a variable that calculates the difference between the 
		// input and the current time in minutes
		var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");

		// this will give us the remaining time until the train stops back
		// into the station
		var timeRemainder = timeDifference % frequency;

		//console.log(timeRemainder);

		// formula to give us the time in minutes until the next train
		var arrivalCountdown = frequency - timeRemainder;

		// console.log("Minutes until next train: " + arrivalCountdown);
		
		// time when next train arrives
		var nextTrain = moment().add(arrivalCountdown, "minutes");

		// converted time to hours hours minutes mintues
		var nextTrainConverted = moment(nextTrain).format("HH:mm");

		// console.log("Arrival Time: " + nextTrainConverted);

		// wouldve liked to style the <td>'s but wasnt sure how to grab them after
		// i created them
		$("#trainScheduleInfo").append("<tr><td class='cell'>" + trainName + "</td><td class='cell'>" + destination + "</td><td class='cell'>" + frequency +  "</td><td class='cell'>" + nextTrainConverted + "</td><td class='cell'>" + arrivalCountdown + " Minutes" + "</td></tr>");

	});
});