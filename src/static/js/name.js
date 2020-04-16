$(".logo-container").click(() => window.location.hef="/")

const setName = () => {
    const data = {
        name: $(".name-input").val()
    }
    $.post({
        url: "/api/setName",
        data:data,
        success: () => {
            window.location.href="/"
        }
    })
}

$(document).keypress((e) => {
    if(e.keyCode === 13) {
        setName()
    }
})

$(".input-container .next-btn").click(() => {
    setName()
})

$(".name-input").focus(() => {
    $(".input-container").addClass("active")
})
  
$(".name-input").focusout(() => {
    const val = $(".name-input").val().trim()
    if(val.length <= 0) {
        $(".input-container").removeClass("active")
    }
})
  
$(document).ready(() => { 
    if($(".name-input").val().replace(" ", "").length > 0 || window.displayName.replace(" ", "").length > 0) {
        $(".input-container").addClass("active")
    }
    $(".name-input").val(window.displayName)
})