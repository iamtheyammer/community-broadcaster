//  Chat Controls


$('.index-chat-wrapper-bottom-textWrap-submit').click(function(){
    var inputVal = $('.index-chat-wrapper-bottom-textWrap textarea').val()
    if(inputVal.length > 0) {
        var whoIs = cap(user.firstName)
        var chatID = makeid(15)
        $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object send"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
        var objectHeight = $('#' + chatID).children().height()
        $('#' + chatID).height(objectHeight)
        $(".index-chat-wrapper-body").scrollTop(10000)
        $('.index-chat-wrapper-bottom-textWrap textarea').val('')
        var data = {"message": inputVal, "chatTag": user.chatTag, "chatID": chatID, "user": user.googleId, "user_firstName": whoIs.toLowerCase()}
        socket.emit('newChat', data)
        $.ajax({
        type: "POST",
        url: "/api/chat/sendMessage",
        data: data,
        });
    } else {
        log('Input insuffi')
    }
})

// socketio Recieve

socket.on('newChat', function(data) {
    var chatID = data.chatID
    var whoIs = cap(data.user_firstName)
    var inputVal = data.message
    if(data.user == user.googleId) {
    
    } else {
        $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object revieve"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
    }
    var objectHeight = $('#' + chatID).children().height()
    $('#' + chatID).height(objectHeight)
    $(".index-chat-wrapper-body").scrollTop(10000)
})

//   Load chats from DB
// Load first 30 chats

if(stream[0].liveChats.length > 30) {
    for(var i = stream[0].liveChats.length - 30; i < stream[0].liveChats.length; i++) {
        var b = i
        var chatID = stream[0].liveChats[b].chatID
        var whoIs = cap(stream[0].liveChats[b].user_firstName)
        var inputVal = stream[0].liveChats[b].message
        if(stream[0].liveChats[b].user == user.googleId) {
            $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object send"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
        } else {
            $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object revieve"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
        }
        var objectHeight = $('#' + chatID).children().height()
        $('#' + chatID).height(objectHeight)
        $(".index-chat-wrapper-body").scrollTop(10000)
    }    
} else {
    for(var i = 0; i < stream[0].liveChats.length; i++) {
        var chatID = stream[0].liveChats[i].chatID
        var whoIs = cap(stream[0].liveChats[i].user_firstName)
        var inputVal = stream[0].liveChats[i].message
        if(stream[0].liveChats[i].user == user.googleId) {
            $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object send"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
        } else {
            $('.index-chat-wrapper-body-content-wrapper').append('<div id="'+chatID+'" class="index-chat-wrapper-body-content-wrapper-object revieve"> <div class="index-chat-wrapper-body-content-wrapper-object-wrapper"> <h3>'+whoIs+'</h3> <div class="index-chat-wrapper-body-content-wrapper-object-chatmodal"> <p>'+inputVal+'</p> </div> </div> </div>')
        }
        var objectHeight = $('#' + chatID).children().height()
        $('#' + chatID).height(objectHeight)
        $(".index-chat-wrapper-body").scrollTop(10000)
    }
}
$(document).ready(function(){
    setTimeout(function(){
        $(".index-chat-wrapper-body").scrollTop(10000)
    }, 200)
})

$('.index-chat-wrapper-bottom-textWrap textarea').keypress(function (e) {
var key = e.which;
if(key == 13)  // the enter key code
    {
    e.preventDefault();
    $('.index-chat-wrapper-bottom-textWrap-submit').click();
    }
});   

$(".comButs").text('Hey ' + cap(user.firstName) + "! write your first message, then select if it's a question or chat!")
