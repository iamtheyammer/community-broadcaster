let autoScroll = true;

const scrollToBottom = () => {
    if(autoScroll) {
        $(".chat-widget .live-chat-container").scrollTop($(".chat-widget .live-chat-container")[0].scrollHeight)
    }
}

const appendChat = (data) => {
    let message = $('<textarea/>').html(data.message).text(); 
    $(".chat-widget .live-chat-container .chat-content").append(`
    <p class="chat">
        <b class="sender">${_.capitalize(data.userChatTag)} - ${_.startCase(_.toLower(data.userName))}</b> 
        ${message}
    </p>

    `)
    $(".chat-widget .no-chats").hide()
    scrollToBottom()
}

const appendAllChats = () => {
    const chats = window.stream.liveChats
    if(!chats || chats.length <=  0) {
        $(".chat-widget .no-chats").show()
        return;
    }
    chats.forEach(appendChat)
}

const setChatStatus = () => {
    const status = window.stream.chatSettings.status
    const statusColors = {
        disabled: "#db1212",
        active: "#00c47c",
        private: "#edc00c"
    }
    $(".chat-widget .title-container .chat-status").css("color", statusColors[status]).text(status)
    
    if(status === "disabled") {
        $(".chat-widget").addClass("disabled")
    }
}



socket.on('newChat', appendChat)

socket.on('chatStatusChange', (status) => {
    window.stream.chatSettings.status = status
    setChatStatus()
})

$('.chat-widget .submit-chat-btn .icon').click(function(){
    var val = $('.chat-widget .chat-input').val()
    if(val.trim().length > 0) {
        var data = {
            "message": val
        }
        $.post({
            url: "/api/chat/sendMessage",
            data: data,
            success: (data) => {
                if(typeof(data) === Object) {
                    appendChat(data)
                }
                $('.chat-widget .chat-input').val("")
            }
        });
    } else {
        log('Input insufficient')
    }
})

setTimeout(() => {
    $(".chat-widget .live-chat-container").scroll(    _.throttle(() => {
        const elem = $(".chat-widget .live-chat-container")
        if(elem[0].scrollTop + elem[0].offsetHeight === elem[0].scrollHeight) {
            autoScroll = true;
            $(".chat-widget .enable-autoscroll").removeClass('active')
        } else {
            autoScroll = false;
            $(".chat-widget .enable-autoscroll").addClass('active')
        }
    }, 50, {leading: true}))
    
    
    $(".chat-widget .enable-autoscroll").click(function() {
        autoScroll = true;
        $(this).removeClass("active")
        scrollToBottom()
    })
}, 200)

$('.chat-widget .chat-input').keypress((e) => {
    if(e.keyCode == 13) {
        e.preventDefault();
        $('.chat-widget .submit-chat-btn .icon').click();
    }
});  

$(document).ready(() => {
    window.stream.liveChats = window.stream.liveChats.sort((a, b) =>  a.timestamp - b.timestamp)
    appendAllChats()
    setChatStatus()
})
