// char entity "icons" for less chars
var i_play  = "▸",
    i_pause = "▮▮",
    i_stop  = "▪";

//
// YouTube iFrame
// API documentation:
// https://developers.google.com/youtube/iframe_api_reference
//

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
var yt_video_data = {
  "sequence": [],
  "furthest": 0,
  "stops":    0
};

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var yt_player;
function onYouTubeIframeAPIReady() {
  yt_player = new YT.Player('youtube_player', {
    height: '281',
    width: '500',
    videoId: 'f7wkRET0hbo',
    // we only need the state change event
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    updateYtVideoData(i_play);
  } else if (event.data == YT.PlayerState.PAUSED) {
    updateYtVideoData(i_pause);
  } else if (event.data == YT.PlayerState.ENDED) {
    updateYtVideoData(i_stop);
  }
}

// tracking interaction data
function updateYtVideoData(which) {
  // getting video progress
  var progress = ytVideoProgress();
  console.log(progress());
  // set furthest if progress is the furthest
  yt_video_data.furthest = Math.max(yt_video_data.furthest, progress);
  // add current video progress to sequence
  yt_video_data.sequence.push([which, progress])
  // if video is complete
  if (which == i_stop) { yt_video_data.stops++; yt_video_data.furthest = 100; }
  // put output in dom
  ytPrintData();
}

// printing the video data
function ytPrintData() {
  var output = "";
  for(var key in yt_video_data) { 
    output += key + ": " + JSON.stringify(yt_video_data[key]) + "\n"; 
  }
  document.getElementById("yt-output").innerHTML = output;
}

// getting video progress in 0-100 percentage value
function ytVideoProgress() {
  var ratio = yt_player.getCurrentTime() / yt_player.getDuration(),
      percent = ratio * 100,
      round_percent = Math.round(percent * 10) / 10;
  return round_percent;
}

// initial call
ytPrintData();



//
// Vimeo player
//   requires Vimeo's froogaloop
// API documentation:
// https://developer.vimeo.com/player/js-api
//

var vm_video_data = {
  "sequence": [],
  "furthest": 0,
  "stops":    0
};

var player = document.getElementById('vimeo_player');

$f(player).addEvent('ready', ready);

// crossbrowser event listener, thanks vimeo
function addEvent(element, eventName, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback, false);
  }
  else {
    element.attachEvent(eventName, callback, false);
  }
}

// when player is ready
function ready(player_id) {

  var player = $f(player_id),
      duration = 0;

  player.addEvent('pause',  onPause);
  player.addEvent('finish', onStop);
  player.addEvent('play',   onPlay);
  
  player.api('getDuration', function (value, id) {    
    duration = value;
  });

  function onPlay(id)  { updateVmVideoData(i_play); }
  function onPause(id) { updateVmVideoData(i_pause); }
  function onStop(id)  { updateVmVideoData(i_stop); }

  // called on each event
  function updateVmVideoData(which) {
    player.api('getCurrentTime', function (time, id) {
      // video progress
      var progress = vmVideoProgress(time);
      // set furthest value if progress is greater
      vm_video_data.furthest = Math.max(vm_video_data.furthest, progress);
      // add current data to sequence
      vm_video_data.sequence.push([which, progress]);
      // if video has ended
      if(which == i_stop) { vm_video_data.stops++; vm_video_data.furthest = 100.2;};
      // print vimeo data in dom
      vmPrintData();
    });
  }
  
  // yielding a progress in 0-100 percentage format
  function vmVideoProgress(time) {
    var ratio = time / duration,
        percent = ratio * 100,
        round_percent = Math.round(percent * 10) / 10;
    return round_percent;
  }
  
  setInterval(function(){console.log(vmVideoProgress);},500);

  // printing the video data
  function vmPrintData() {
    var output = "";
    for(var key in vm_video_data) { 
      output += key + ": " + JSON.stringify(vm_video_data[key]) + "\n"; 
    }
    document.getElementById("vm-output").innerHTML = output;
  }
  
  // initial print
  vmPrintData();
}


jakealbaughSignature();
