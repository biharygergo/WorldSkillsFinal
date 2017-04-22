
$(function () {

  var currentClass = 'runner2';
  var obstacles = [];
  var isJumping = false;

  $('html').keydown(function (e) {

    switch (e.which) {
      case 38:
        moveUp();
        break;
      case 40:
        moveDown();
        break;
      case 32:
        jump();
        break;

    }
  });

 

  function jump() {
    var runnerId = ".runner" + currentClass.substring(6);


    if(!isJumping){
      isJumping = true;

      var originalMargin = (parseInt($(runnerId).css("marginBottom")));
      $(runnerId).animate({'marginBottom' : (originalMargin + 40)}, {
        duration: 200,
        complete: function(){
          $(runnerId).animate({'marginBottom':(originalMargin)}, {
            duration: 200,
            complete: function(){
              isJumping = false;
              $("#runner").attr({"style": ""});
            }
          }).dequeue();
        }
        }).dequeue();
    }
  }
  function moveUp() {
    if(!isJumping){
    var runner = $("#runner");
    var laneClass = $("#runner").attr('class');

    switch (laneClass) {
      case 'runner1':
        break;
      case 'runner2':
        runner.removeClass(laneClass);
        runner.addClass('runner1');
        break;
      case 'runner3':
        runner.removeClass(laneClass);
        runner.addClass('runner2');
        break;
    }

    currentClass = $("#runner").attr('class');
    }
  }

  function moveDown() {
    if (!isJumping) {
      var runner = $("#runner");

      var laneClass = $("#runner").attr('class');

      switch (laneClass) {
        case 'runner1':
          runner.removeClass(laneClass);
          runner.addClass('runner2');
          break;
        case 'runner2':
          runner.removeClass(laneClass);
          runner.addClass('runner3');
          break;
        case 'runner3':
          break;
      }

      currentClass = $("#runner").attr('class');
    }
  }


  $('#startButton').click(function () {
    
    $("#amazon").toggle("fade");
    $("#bahia").toggle("fade");
    $("#saopaulo").toggle("fade");
    $("#rio").toggle("fade");
    $("#parana").toggle("fade");


    addObstacles();
    animateGame()
  });

  function animateGame() {
// record start time
    var leftPos = $('body').scrollLeft();
    leftPos = leftPos + 216;

    $("body").animate({scrollLeft: 5632 * 0.14 * 6},{
      duration: 12000,
        step: function(){
      }
    });

    $("#runner").animate({'marginLeft':5632 * 0.14 * 6}, {
      duration: 12000,
      step: function(left){
        checkObstacle(left);
        animateBackground(left);
      },
      complete: function(){
        var originalMargin = (parseInt($("#runner").css("marginBottom")));
        $("#runner").animate({'marginBottom' : (originalMargin + 120), 'marginLeft': 5100}, {
          duration: 3000,
          complete: function () {
            $("#pyreImage").attr("src" ,"imgs/pyre_fire.svg")
            $("#runner").addClass("hidden");
          }

        }).dequeue();
      }
    });


  }

  function addObstacles(){
    var runway1current = 0;
    var runway2current = 0;

    var runway3current = 0;

    for(var i = 0; i<18 ;i++){
      var laneId = (i % 3) + 1;

      $("#runway"+laneId).append("<span id='obstacle"+i+"'class='obstacle'></span>");
      var randomMargin = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
      $("#obstacle"+i).css({'marginLeft' : randomMargin});

      switch (laneId){
        case 1:
          runway1current += randomMargin;
          $("#obstacle"+i).attr('leftPosition', runway1current);
          break;
        case 2:
          runway2current += randomMargin;
          $("#obstacle"+i).attr('leftPosition', runway2current);


          break;
        case 3:
          runway3current += randomMargin;
          $("#obstacle"+i).attr('leftPosition', runway3current);

          break;
      }
    }

    obstacles = $(".obstacle").toArray();
  }

  function checkObstacle(runnerLeft) {


    obstacles.forEach(function (obstacle) {
      var runwayId = obstacle.parentNode.id.substring(6);
      var runnerId = currentClass.substring(6);

      var obstacleId = "#"+ obstacle.id;
      var scrollLeft = $(obstacleId).attr('leftPosition');

      if(runwayId === runnerId && scrollLeft > runnerLeft+135 && scrollLeft < runnerLeft+135 && !isJumping){
        $("body").stop();
        $("#runner").stop();
        alert("Game over!");
      }

    });

  }

  var slice = 5632 * 0.14;

  var shownAmazon, shownBahia, shownParana, shownSao, shownRio = false;
  var currentPos = 0;
  function animateBackground(runnerLeft){

    if(runnerLeft > 788 && runnerLeft > currentPos){

       if(runnerLeft < 1576 &&!shownAmazon){
        $("#amazon").toggle("fade");
        currentPos = 1576;
         shownAmazon = true;
         return;

       }
      else if(runnerLeft < 2365 && !shownBahia){
        $("#bahia").toggle("fade");
        currentPos = 2365;
        shownBahia = true;

        return;


      }
      else if(runnerLeft < 3153 && !shownParana){
        $("#parana").toggle("fade");
        shownParana = true;

        currentPos = 3153;
        return;

      }
      else if(runnerLeft < 3942 && !shownSao){
        $("#saopaulo").toggle("fade");
        shownSao = true;

        currentPos = 3942;
      }

      else if(runnerLeft < 4730 && !shownRio){
        $("#rio").toggle("fade");
        shownRio = true;

        currentPos = 4730;
      }

    }
  }
  function interval(func, wait, times) {
    var interv = function (w, t) {
      return function () {
        if (typeof t === "undefined" || t-- > 0) {
          setTimeout(interv, w);
          try {
            func.call(null);
          }
          catch (e) {
            t = 0;
            throw e.toString();
          }
        }
      };
    }(wait, times);

    setTimeout(interv, wait);
  };
});