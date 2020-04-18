

const searchViewers = () => {
    const val = $(".viewers-table .search-container .search-input").val().toLowerCase()
    if($('.viewers-table .viewer:not(.hidden)').length <= 0 ) {
        $(".viewers-table .no-viewers").show()
    } else {
        $(".viewers-table .no-viewers").hide()
    }
}

const applyGradeFilter = (grade) => {
    const viewers = $(".viewers-table .viewer")
    if(grade==="all") {
        viewers.removeClass('hidden')
        searchViewers()
        return;
    }
    viewers.each(function() {
        const e = $(this)
        console.log(e.find(".viewer-grade-info").text())
        console.log(grade)
        if(e.find(".viewer-grade-info").text().toLowerCase() === grade) {
            $(this).removeClass('hidden')
        } else {
            $(this).addClass('hidden')
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
    if(!window.allParticipants) {
        // Show no participants
        return;
    }
    window.allParticipants.forEach((u) => {
        const fullName = 
            u.firstName[0].toUpperCase() + u.firstName.slice(1) + " " +
            u.lastName[0].toUpperCase() + u.lastName.slice(1)
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
                    <p class="viewer-grade-info">${u.grade === 0 ? "Unkown" : u.grade}</p>
                </td>
                <td>
                    <div class="action-btn-wrap">
                        <p class="kick-user">Kick User</p>
                        <p class="ban-user">Ban User</p>
                    </div>
                </td>
            </tr>
        `)
    })
}

$(document).ready(() => {
    appendParticipants()
})