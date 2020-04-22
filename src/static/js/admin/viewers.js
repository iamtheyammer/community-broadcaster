
const searchViewers = () => {
    const val = $(".viewers-table .search-container .search-input").val().toLowerCase()
    const viewers = $(".viewers-table .viewer")

    viewers.each(function() {
        const e = $(this)
        const name = e.find(".viewer-name-info").text().toLowerCase()
        const firstName = name.split(" ")[0]
        const lastName = name.split(" ")[1]
        const email = e.find(".viewer-email-info").text().toLowerCase()
        if(email.startsWith(val) || firstName.startsWith(val) || lastName.startsWith(val) || name.startsWith(val)) {
            e.removeClass('search-hidden')
        } else {
            e.addClass('search-hidden')
        }
    })

    if($('.viewers-table .viewer:not(.grade-hidden, .search-hidden)').length <= 0 ) {
        $(".viewers-table .no-viewers").show()
    } else {
        $(".viewers-table .no-viewers").hide()
    }
}

const applyGradeFilter = (grade) => {
    const viewers = $(".viewers-table .viewer")
    if(grade==="all") {
        viewers.removeClass('grade-hidden')
        searchViewers()
        return;
    }
    viewers.each(function() {
        const e = $(this)
        console.log(e.find(".viewer-grade-info").text())
        console.log(grade)
        if(e.find(".viewer-grade-info").text().toLowerCase() === grade) {
            $(this).removeClass('grade-hidden')
        } else {
            $(this).addClass('grade-hidden')
        }
    })
    searchViewers()
}

$(".viewers-table .search-container .search-input").on('input', searchViewers)

$(".viewers-table .search-container .grade-filter-container .grade-option").click(function() {
    if($(this).hasClass("active")) {
        return;
    }
    $(".viewers-table .search-container .grade-filter-container .grade-option").removeClass('active')
    $(this).addClass('active')
    const grade = "" + $(this).data("grade")
    applyGradeFilter(grade)
})

const appendParticipants = () => {
    $(".viewers-table tbody .viewer").remove()
    if(!window.allParticipants || window.allParticipants.length <= 0) {
        $(".viewers-table .no-viewers").show()
        return;
    }
    window.allParticipants.forEach((u) => {
        const fullName = 
            u.firstName[0].toUpperCase() + u.firstName.slice(1) + " " +
            u.lastName[0].toUpperCase() + u.lastName.slice(1)
        if(!u.banned) {
            $(".viewers-table tbody").append(`
                <tr class="viewer" data-google-id="${u.googleId}">
                    <td class="viewer-picture-container">
                        <div class="viewer-picture-info" style="background-image:url(${u.googleProfilePicture});"></div> 
                    </td>
                    <td>
                        <p class="viewer-name-info">${fullName}</p>
                    </td>
                    <td>
                        <p class="viewer-email-info">${u.email}</p>
                    </td>
                    <td>
                        <p class="viewer-grade-info">${u.grade === 0 ? "None" : u.grade}</p>
                    </td>
                    <td>
                        <div class="action-btn-wrap">
                            <p class="ban-user">Ban User</p>
                        </div>
                    </td>
                </tr>
            `)

            
        }
    })
}

$(document).ready(() => {
    appendParticipants()
})

$(() => { // BAN CODE
    $(document).on("click", ".viewers-table .viewer .ban-user", function() {
        const data = {
            googleId: $(this).parents(".viewer").data("google-id")
        }
        $.post({
            url: "/admin/api/banUser",
            data: data,
            success: () => {
                window.location.reload()
            }
        })
    })

    $(document).on("click", ".banned-viewers-table .viewer .unban-user", function() {
        const data = {
            googleId: $(this).parents(".viewer").data("google-id")
        }
        $.post({
            url: "/admin/api/unbanUser",
            data: data,
            success: () => {
                window.location.reload()
            }
        })
    })

})

socket.on("participantsChange", () => {
    $.get({
        url: "/admin/api/getParticipants",
        success: (data) => {
            window.allParticipants = data
            appendParticipants()
            applyGradeFilter($(".viewers-table .search-container .grade-filter-container .grade-option.active").data("grade"))
        }
    })
})