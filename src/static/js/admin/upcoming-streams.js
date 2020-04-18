let datePicker = new SimplePicker();
datePicker.setDate(new Date());

const appendTableStream = (meetings) => {
    console.log(meetings)
    if(!meetings || meetings.length <= 0) {
        $(".upcoming-streams-table .no-streams").addClass('active')
    }
    const sortedMeetings = meetings.sort((a, b) =>  new Date(a.startTime) - new Date(b.startTime))
    sortedMeetings.forEach((m) => {
        
        $(".upcoming-streams-table tbody").append(`
            <tr class="stream" data-stream-id="${m.streamId}">
                <td><p class="order-id-info">${m.streamId}</p></td>
                <td><p class="stream-name-info">${m.name}</p></td>
                <td><p class="stream-date-head">${moment(m.startTime).format('LL')}</p></td>
                <td><p class="stream-time-head">${moment(m.startTime).format("hh:mm A")}</p></td>
                <td>
                    <div class="action-btn-wrap">
                        <div class="action-btn edit-btn">
                            <div class="icon"></div>
                        </div>
                        <div class="action-btn delete-btn">
                            <div class="icon"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `)
    })
}

$(".add-meeting-btn").click(() => {
    $(".add-meeting-modal").addClass("active")
    $(".darken-overlay").addClass("active")
})

$(".modal-container .cancel-btn").click(function() {
    $(".modal-container").removeClass("active")
    $(".darken-overlay").removeClass("active")
    $(".modal-container input").val("")
    $(".modal-container .input-container.name-input-container").removeClass("active")
    $('.modal-container .input-container').removeClass("error")
    $(".modal-container .date-time-container .date-time-display").removeClass("error")
    datePicker.setDate(new Date())
    $(".modal-container .date-time-container .date-time-display").text("No selected date or time.")
    $(".modal-container .date-time-container .date-time-display").removeAttr("data-date")
})

$(".modal-container .name-input").focus(function() {
    $(this).parent(".input-container").addClass("active")
})

$('.modal-container .name-input').on('input', function() {
    if($(this).val().trim().length > 0) {
        $(this).parent(".input-container").removeClass("error")
    }
})

$(".modal-container .name-input").focusout(function() {
    const val = $(this).val().replace(" ", "")
    if(val.length <= 0) {
        $(this).parent(".input-container").removeClass("active")
    }
})

$(document).on('click', '.upcoming-streams-table .action-btn.delete-btn', function() {
    const streamId = $(this).parents("tr.stream").attr('data-stream-id')
    $(".delete-meeting-modal .modal-title").text(`Delete Community Meeting: ${streamId}`)
    $(".delete-meeting-modal .submit-btn").attr("data-stream-id", streamId)
    $(".delete-meeting-modal").addClass("active")
    $(".darken-overlay").addClass("active")
})

$('.add-meeting-modal .date-time-picker-btn').click(() => {
    if(!$(".date-time-display").attr("data-date")) {
        datePicker.setDate(new Date());
    }
})

const checkErrors = (container) => {
    const case1 = container.find(".name-input").val().trim().length <= 0
    const case2 = ! container.find(".date-time-display").attr('data-date')
    let shouldReturn = false;
    if(case1) {
        container.find(".name-input-container").addClass("error")
        shouldReturn = true;
    }
    if(case2) {
        container.find(".date-time-display").addClass("error")
        shouldReturn = true;
    }
    return shouldReturn;
}

$(".delete-meeting-modal .submit-btn").click(function() {
    const data = {
        streamId:$(this).attr("data-stream-id")
    }
    $.post({
        url: "/admin/api/deleteStream",
        data:data,
        success: () => {
            $(".delete-meeting-modal .cancel-btn").click()
            $(`.upcoming-streams-table tr.stream[data-stream-id="${data.streamId}"`).remove()
            if($(".upcoming-streams-table tr.stream").length <= 0) {
                $(".upcoming-streams-table .no-streams").addClass('active')
            }
        }
    })
})

$('.add-meeting-modal .submit-btn').click(() => {
    if(checkErrors($(".add-meeting-modal"))) return;
    const data = {
        name: $(".add-meeting-modal .name-input").val(),
        date: $(".add-meeting-modal .date-time-display").attr('data-date')
    }
    $.post({
        url: "/admin/api/createStream",
        data:data,
        success: (data) => {
            window.location.reload()
        }
    })
})

$(".date-time-picker-btn").click(() => {
    datePicker.open()
})

datePicker.on('submit', function(date, readableDate){
    $(".date-time-container .date-time-display").removeClass("error")
    $(".date-time-container .date-time-display").text(readableDate)
    $(".date-time-container .date-time-display").attr("data-date", date)
})

$(document).ready(() => {
    appendTableStream(window.streams)
}) 