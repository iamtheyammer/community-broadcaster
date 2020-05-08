let autoScroll = true;

const scrollToBottom = () => {
    if(autoScroll) {
        $(".mod-wrapper-right-body-wrapper").scrollTop($(".mod-wrapper-right-body-wrapper")[0].scrollHeight)
    }
}

const deleteChat = (chatID) => {
    $(`.mod-wrapper-right-body-wrapper #${chatID}`).remove()
}

const appendChat = (data) => {
    let message = $('<textarea/>').html(data.message).text(); 
    $('.mod-wrapper-right-body-wrapper').append(`
        <div class="chat-wrap" id ="${data.chatID}">
            <p class="chat">
                <b class="sender">${_.capitalize(data.userChatTag)} - ${_.startCase(_.toLower(data.userName))}</b> 
                ${message}
            </p>
        </div>
    `)
    scrollToBottom()
}

socket.on("newChatAdmin", function(data) {
    appendChat(data)
})

const appendLiveChats = () => {
    if(!window.stream.liveChats || window.stream.liveChats.length <= 0) {
        return;
    }

    window.stream.liveChats.forEach(appendChat)
}

$(document).ready(() => {
    appendLiveChats()
})

setTimeout(() => {
    $(".mod-wrapper-right-body-wrapper").scroll(_.throttle(() => {
        const elem = $(".mod-wrapper-right-body-wrapper")
        if(elem[0].scrollTop + elem[0].offsetHeight === elem[0].scrollHeight) {
            autoScroll = true;
            $(".enable-autoscroll").removeClass('active')
        } else {
            autoScroll = false;
            $(".enable-autoscroll").addClass('active')
        }
    }, 50, {leading: true}))
    
    
    $(".enable-autoscroll").click(function() {
        autoScroll = true;
        $(this).removeClass("active")
        scrollToBottom()
    })
}, 200)

$('.mod-wrapper-right-bottom-chatWrap-textarea textarea').keypress((e) => {
    if(e.keyCode == 13) {
        e.preventDefault();
        $('.mod-wrapper-right-bottom-chatWrap-buttons-send').click();
    }
});  

$('.mod-wrapper-right-bottom-chatWrap-buttons-send').click(function(){
    var val = $('.mod-wrapper-right-bottom-chatWrap-textarea textarea').val()
    if(val.trim().length > 0) {
        var data = {
            "message": val
        }
        $.post({
            url: "/api/chat/sendMessage",
            data: data,
            success: () => {
                $('.mod-wrapper-right-bottom-chatWrap-textarea textarea').val("")
            }
        });
    } else {
        log('Input insufficient')
    }
})

const hideChatOptions = () => {
    $(".chat-options-container").removeAttr("data-chat-id").hide()
    $(".mod-wrapper-right-body-wrapper .chat-wrap").removeClass("active")
}

$(".mod-wrapper-right-body-wrapper").scroll(() => {
    hideChatOptions()
})

$(document).on("click", ".mod-wrapper-right-body-wrapper .chat-wrap", function(e) {
    let x = e.originalEvent.x,
        y = e.originalEvent.y
    $(".chat-options-container").css("top", `${y}px`)
    $(".chat-options-container").css("left", `${x}px`)
    $(".mod-wrapper-right-body-wrapper .chat-wrap").removeClass("active")
    $(this).addClass("active")
    const chatId = $(this).attr("id")
    $(".chat-options-container").attr("data-chat-id", chatId).show()
})

$(document).on("click", function(e) {
    if($(e.target).closest('.mod-wrapper-right-body-wrapper .chat-wrap').length || $(e.target).closest('.chat-options-container').length) return;
    hideChatOptions()
})

$(".chat-options-container .delete-chat-btn").click(() => {
    const data = {
        chatID: $(".chat-options-container").attr("data-chat-id")
    }
    if(!data.chatID) {
        return;
    }

    $.post({
        url: "/admin/api/deleteChat",
        data: data,
        success: () => {
            hideChatOptions()
        }
    })
})

socket.on("deleteChat", deleteChat)