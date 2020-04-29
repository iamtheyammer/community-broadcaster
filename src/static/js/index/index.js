var player = window.player = videojs('#my-video', {
  html5: {
    hls: {
      overrideNative: true
    },
    nativeAudioTracks: false,
    nativeVideoTracks: false
  }
});
// player.src({
//   type: 'application/x-mpegURL',
//     src: 'https://stream.designtechhs.com/playlist.m3u8'
// });

// let qualityLevels = player.qualityLevels();
let videoPlay = player.play();
player.hlsQualitySelector();

if(videoPlay !== undefined) {
  videoPlay.then(_ => {
    player.play();
    player.muted(false);
  }).catch(error => {
    player.play();
    player.muted(false);
  })
}

var isPlaying = false;

player.on(['waiting', 'pause'], function() {
  isPlaying = false;
});

player.on('playing', function() {
  isPlaying = true;
});

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
    if(isPlaying){
      player.pause();
    } else {
      player.play();
    }
  }
}

socket.on('reloadStreamClients', function(data) {
  location.reload();
})

socket.on('logoutAllStreamClients', function(data) {
  window.location.href = '/auth/logout'
})

socket.on('slateControl', function(data) {
  log(data)
  if(data[1].state) {
    $('.slate').show()
    if(data[1].selection == "Bars and Tones") {
      $('.slate').css('background-image', 'url("/img/2880px-SMPTE_Color_Bars_16x9.svg.png")')
    }
    if(data[1].selection == "Splash") {
      $('.slate').css('background-image', 'url("/img/download.jpeg")')
    }
    if(data[1].selection == "Maintainance") {
      $('.slate').css('background-image', 'url("/img/dtech-logo.png")')
    }
  } else {
    $('.slate').hide()
    if(data[1].selection == "Bars and Tones") {
      $('.slate').css('background-image', 'url("/img/2880px-SMPTE_Color_Bars_16x9.svg.png")')
    }
    if(data[1].selection == "Splash") {
      $('.slate').css('background-image', 'url("/img/download.jpeg")')
    }
    if(data[1].selection == "Maintainance") {
      $('.slate').css('background-image', 'url("/img/dtech-logo.png")')
    }
  }
})

for(var i = 0; i < siteControls.length; i++) {
  if(siteControls[i].identifier == "slate") {
    let slateType = siteControls[i].slateType
    if(slateType == 1) {
      $('.slate').css('background-image', 'url("/img/2880px-SMPTE_Color_Bars_16x9.svg.png")')
    }
    if(slateType == 2) {
      $('.slate').css('background-image', 'url("/img/download.jpeg")')
    }
    if(slateType == 3) {
      $('.slate').css('background-image', 'url("/img/dtech-logo.png")')
    }
  }
}

setTimeout(function(){
  for(var i = 0; i < siteControls.length; i++) {
    if(siteControls[i].identifier == "slate") {
      if(siteControls[i].state) {
        $('.slate').show()
      } else {
        $('.slate').hide()
      }
    }
  }
},600)

setTimeout(function(){
  if($('.vjs-modal-dialog-content').text() == "The media could not be loaded, either because the server or network failed or because the format is not supported.TextColorWhiteBlackRedGreenBlueYellowMagentaCyanTransparencyOpaqueSemi-TransparentBackgroundColorBlackWhiteRedGreenBlueYellowMagentaCyanTransparencyOpaqueSemi-TransparentTransparentWindowColorBlackWhiteRedGreenBlueYellowMagentaCyanTransparencyTransparentSemi-TransparentOpaqueFont Size50%75%100%125%150%175%200%300%400%Text Edge StyleNoneRaisedDepressedUniformDropshadowFont FamilyProportional Sans-SerifMonospace Sans-SerifProportional SerifMonospace SerifCasualScriptSmall CapsReset restore all settings to the default valuesDone") {
    $('.slate').show()
  } else {
    $('.slate').hide()
  }
},500)

socket.on('participantsChange', function(count){
$(".stream-info-container .viewer-count-container p").text(`${count} Viewers`)
})

$(document).ready(() => {
$('.stream-info-container .stream-title').text(stream.name)
$('.stream-info-container .stream-runner').text(stream.runner)
$(".stream-info-container .viewer-count-container p").text(`${stream.participantCount + 1} Viewers`)
})


window.onload = () => {
  setTimeout(() => {
    socket.emit('initParticipant', window.user.googleId)
  }, 3000)
}

// const fixVideoHeight = () => {
//   $(".stream-video").height($(".vjs-poster").height())
//   $(".slate").height($(".vjs-poster").height())
//   $(".slate").width($(".vjs-poster").width())
// }

//$(window).resize(fixVideoHeight)

// window.onload = () => {
//   setTimeout(function(){
//     fixVideoHeight()
//   }, 300)
// }