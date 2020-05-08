let autoScroll = true;

const scrollToBottom = () => {
    if(autoScroll) {
        $(".chat-widget .live-chat-container").scrollTop($(".chat-widget .live-chat-container")[0].scrollHeight)
    }
}

const deleteChat = (chatID) => {
    $(`.chat-widget .live-chat-container .chat-content #${chatID}`).remove()
}

const appendChat = (data) => {
    $('.chat-widget .chat-content .chat.cooldown').remove()
    let message = $('<textarea/>').html(data.message).text(); 
    $(".chat-widget .live-chat-container .chat-content").append(`
    <p class="chat" id ="${data.chatID}">
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
    let status = window.stream.chatSettings.status
    if(window.user.muted) status = "muted"
    const statusColors = {
        disabled: "#db1212",
        muted: "#db1212",
        active: "#00c47c",
        private: "#edc00c"
    }
    $(".chat-widget .chat.muted").remove()
    
    $(".chat-widget .title-container .chat-status").css("color", statusColors[status]).text(status)
    
    if(status === "disabled" || status === "muted") {
        $(".chat-widget").addClass("disabled")
    } else {
        $(".chat-widget").removeClass("disabled")
    }

    if(status === "muted") {
        $(".chat-widget .live-chat-container .chat-content").append(`
            <p class="chat muted">
                You have been muted by a moderator.
            </p>
        `)
    }
}



socket.on('newChat', appendChat)

socket.on('chatStatusChange', (status) => {
    window.stream.chatSettings.status = status
    setChatStatus()
})

socket.on("deleteChat", deleteChat)

socket.on('muteUser', (status) => {
    window.user.muted = status
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
                if(typeof(data) === "object") {
                    if(data.type === "chat") {
                        appendChat(data)
                    } else if (data.type === "cooldown") {
                        $('.chat-widget .chat-content .chat.cooldown').remove()
                        $(".chat-widget .live-chat-container .chat-content").append(`
                            <p class="chat cooldown">
                                Wait ${data.timeLeft} seconds before chatting again.
                            </p>
                        `)
                        $(".chat-widget .live-chat-container").scrollTop($(".chat-widget .live-chat-container")[0].scrollHeight)
                    }
                    
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
