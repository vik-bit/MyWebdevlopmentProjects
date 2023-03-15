//function for common procedures
//1 to 6 no generator
function rollDice(){
    return Math.floor(Math.random() * 6) + 1;
  }
  //function to select images
  function imgSelector(classs, n){
    document.querySelector(classs).setAttribute("src", "images/dice" + n + ".png");
  }
  //function to display results
  function displayResults(result){
    document.querySelector("h1").innerText = result;
  }
  
  // main program
  // for player 1
  var dice1 = rollDice();
  imgSelector(".img1",dice1);
  //for player2
  var dice2 = rollDice();
  imgSelector(".img2",dice2);
  // display results
  if(dice1 > dice2){
    displayResults("🏆Player 1 Wins!") ;
  }
  else if(dice1 < dice2){
    displayResults("Player 2 Wins!🏆") ;
  }
  else{
    displayResults("Draw");
  }
