const updateParticipantLogsCSVArr = () => {
    let CSVArr = [];
    CSVArr.push(["GoogleID", "Name", "Email", "Action", "Date/Time"])
    CSVArr = [...CSVArr, ...window.participantLogs.sort((a, b) =>  b.timestamp - a.timestamp).map(x => [x.googleId, x.name, x.email, x.type === "join" ? "joined" : "left", moment(x.timestamp).format("LLL").replace(/,/g, "")])]
    let csvContent = "data:text/csv;charset=utf-8," 
    CSVArr.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    let = file = encodeURI(csvContent)
    const btn = $(".viewer-logs-container .download-csv-btn")
    btn.attr("href", file)
    btn.attr("target", "_blank")
    btn.attr("download", `viewerLogs${moment(Date.now()).format("MM-DD-YYYY_hh-mmA")}.csv`)
}

const updateViewersCSVArr = () => {
    let CSVArr = [];
    CSVArr.push(["GoogleID", "Name",  "Email", "Grade"])
    CSVArr = [...CSVArr, ...window.allParticipants.sort((a, b) =>  a.grade - b.grade).map(x => [x.googleId, x.firstName[0].toUpperCase() + x.firstName.slice(1) + " " + x.lastName[0].toUpperCase() + x.lastName.slice(1), x.email, x.grade === 0 ? "None" : x.grade])]
    let csvContent = "data:text/csv;charset=utf-8," 
    CSVArr.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    let = file = encodeURI(csvContent)
    const btn = $(".viewers-table .download-csv-btn")
    btn.attr("href", file)
    btn.attr("target", "_blank")
    btn.attr("download", `activeViewers${moment(Date.now()).format("MM-DD-YYYY_hh-mmA")}.csv`)
}

const viewerCounts = () => {
    const counts = {
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "none": 0
    }
    window.allParticipants.forEach((p) => {
        const grade = p.grade
        if(grade===0) {
            counts["none"]++
        } else {
            counts[grade + ""]++
        }
    })
    counts.all = counts["9"] + counts["10"] + counts["11"] + counts["12"] + counts["none"]
    $('.grade-filter-container .grade-option[data-grade="all"] b').text(`(${counts["all"]})`)
    $('.grade-filter-container .grade-option[data-grade="9"] b').text(`(${counts["9"]})`)
    $('.grade-filter-container .grade-option[data-grade="10"] b').text(`(${counts["10"]})`)
    $('.grade-filter-container .grade-option[data-grade="11"] b').text(`(${counts["11"]})`)
    $('.grade-filter-container .grade-option[data-grade="12"] b').text(`(${counts["12"]})`)
    $('.grade-filter-container .grade-option[data-grade="none"] b').text(`(${counts["none"]})`)
    return counts
}

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
        $(".viewers-table .no-viewers").css("display", "block")
    } else {
        $(".viewers-table .no-viewers").css("display", "none")
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
        $(".viewers-table .no-viewers").css("display", "block")
        return;
    }
    viewerCounts()
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

const searchParticipantLogs = () => {
    const val = $(".viewer-logs-container .search-input").val().toLowerCase()
    const logs = $(".viewer-logs-container .log")

    if(val.trim().length <= 0) {
        logs.removeClass('hidden')
        return;
    }

    logs.each(function() {
        const e = $(this)
        const name = e.data("name").toLowerCase()
        const firstName = name.split(" ")[0]
        const lastName = name.split(" ")[1]
        const email = e.data("email").toLowerCase()
        if(email.startsWith(val) || firstName.startsWith(val) || lastName.startsWith(val) || name.startsWith(val)) {
            e.removeClass('hidden')
        } else {
            e.addClass('hidden')
        }
    })

    if($('.viewer-logs-container .log:not(.hidden)').length <= 0 ) {
        $(".logs-container .no-logs").show()
    } else {
        $(".logs-container .no-logs").hide()
    }
}

$(".viewer-logs-container .search-input").on("input", searchParticipantLogs)

const appendParticipantLog = (data) => {
    const message = `${data.name} ${data.type==="join" ? "joined" : "left"} the stream. <b>${data.email}</b>`
    $(".viewer-logs-container .logs-container").prepend(`
        <div class="log ${data.type}" data-name="${data.name}" data-email="${data.email}">
            <p class="msg">${message}</p>
            <p class="time">${moment(data.timestamp).format("LLL")}</p>
        </div>
    `)
    $(".logs-container .no-logs").hide()
}

const appendAllParticipantLogs = () => {
    if(!window.participantLogs || window.participantLogs.length <= 0) {
        $(".logs-container .no-logs").show()
        return;
    }
    window.participantLogs = window.participantLogs.sort((a, b) =>  a.timestamp - b.timestamp)
    window.participantLogs.forEach(appendParticipantLog)
    updateLogsCounts()
}

const updateLogsCounts = () => {
    const count = window.participantLogs.length
    $(".viewer-logs-container .title").html(`Viewer Logs <b>(${count})</b>`)
}

$(document).ready(() => {
    appendParticipants()
    appendAllParticipantLogs()
    updateParticipantLogsCSVArr()
    updateViewersCSVArr()
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
                setTimeout(() => {
                    window.location.reload()
                }, 500)
                
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
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            }
        })
    })

})

socket.on("participantsChange", () => {
    $.get({
        url: "/admin/api/getParticipants",
        success: (data) => {
            window.allParticipants = data
            updateViewersCSVArr()
            appendParticipants()
            applyGradeFilter($(".viewers-table .search-container .grade-filter-container .grade-option.active").data("grade"))
        }
    })
})

socket.on("participantLogsChange", (data) => {
    window.participantLogs.push(data)
    window.participantLogs = window.participantLogs.sort((a, b) =>  a.timestamp - b.timestamp)
    updateParticipantLogsCSVArr()
    updateLogsCounts()
    appendParticipantLog(data)
})