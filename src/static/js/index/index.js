
  setTimeout(function(){
    var player = videojs('#my-video');
    var videoPlay = player.play();
    if(videoPlay !== undefined) {
      videoPlay.then(_ => {
        player.play();
        player.muted(false);
      }).catch(error => {
        player.play();
        player.muted(false);
      })
    }
  }, 1000)

  socket.on('reloadStreamClients', function(data) {
    location.reload();
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

  socket.on('clientChange', function(data){
    $('.index-wrapper-center-stream-wrapper-dataTrails-right-data p').text('Live Viewers: ' +  data[0]);
  })


  //  Chat Controls


  $('.index-chat-wrapper-bottom-textWrap-submit').click(function(){
    var inputVal = $('.index-chat-wrapper-bottom-textWrap textarea').val()
    if(inputVal.length > 0) {
      var whoIs = name
      var chatID = makeid(15)
      $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object send"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
      var objectHeight = $('#' + chatID).children().height()
      $('#' + chatID).height(objectHeight)
      $(".index-chat-wrapper-body").scrollTop(10000)
      $('.index-chat-wrapper-bottom-textWrap textarea').val('')
    } else {
      log('Input insuffi')
    }
    
  })

  $('.index-chat-wrapper-bottom-textWrap textarea').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
      e.preventDefault();
      $('.index-chat-wrapper-bottom-textWrap-submit').click();
     }
   });   

$(".index-chat-wrapper-body-content-wrapper-object-chatmodal").text('Hey ' + name + "! write your first message, then select if it's a question or chat!")

$('.streamTitle').text(stream[0].streamName)
$('.streamRunner').text(stream[0].streamRunner)