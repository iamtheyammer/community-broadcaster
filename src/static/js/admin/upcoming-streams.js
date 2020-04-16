$(".add-meeting-btn").click(() => {
    $(".add-meeting-modal").addClass("active")
    $(".darken-overlay").addClass("active")
})

$(".modal-container .cancel-btn").click(function() {
    $(".modal-container").removeClass("active")
    $(".darken-overlay").removeClass("active")
    $(".modal-container input").val("")
    $(".modal-container .input-container.name-input-container").removeClass("active")
    $(".date-time-container .date-time-display").text("No selected date or time.")
    $(".date-time-container .date-time-display").removeAttr("data-date")
})

$(".modal-container .name-input").focus(function() {
    $(this).parent(".input-container").addClass("active")
})

$(".modal-container .name-input").focusout(function() {
    const val = $(this).val().replace(" ", "")
    if(val.length <= 0) {
        $(this).parent(".input-container").removeClass("active")
    }
})

$(".upcoming-streams-table .action-btn.delete-btn").click(function() {
    $(".delete-meeting-modal").addClass("active")
    $(".darken-overlay").addClass("active")
})

let datePicker = new SimplePicker();

$(".date-time-picker-btn").click(() => {
    datePicker.open()
})

datePicker.on('submit', function(date, readableDate){
    $(".date-time-container .date-time-display").text(new Date(date))
    $(".date-time-container .date-time-display").attr("data-date", date)
})
    