const categories = {
    bans: {title: "Bans/Unbans", color: "#E74B3B"},
    firstLogin: {title: "First Login", color: "#28AE60" },
    upcomingStreams: {title: "Upcoming Streams", color: "#3467eb"}
}

const filterLogs = () => {
    $(".logs-container .log").each(function() {
        const e = $(this)
        if(checkSearch(e) && checkCategory(e)) {
            e.removeClass("hidden")
        } else {
            e.addClass("hidden")
        }
    })
    if($(".logs-container .log:not(.hidden)").length <= 0) {
        $(".no-logs").show()
    }  else {
        $(".no-logs").hide()
    }
}

const checkSearch = (e) => {
    const val = $(".search-container .search-input").val().toLowerCase()
    if(val.trim().length <= 0) {
        return true;
    }

    if(e.find(".message").text().toLowerCase().includes(val)) {
        return true;
    } else {
        return false;
    }
}

const checkCategory = (e) => {
    const category = $(".log-type-filter-container .log-type-select .select-btn .select-value").text().toLowerCase()
    if(category === "all") {
        return true;
    }
    if(e.find(".log-type").text().toLowerCase() === category) {
        return true;
    } else {
        return false;
    }
}

$(document).on("click", ".log-type-filter-container .log-type-select .select-menu .option", function() {
    $(".log-type-filter-container .log-type-select").removeClass('active')
    if($(this).hasClass("active")) {
        return;
    }
    $(".log-type-filter-container .log-type-select .select-menu .option").removeClass("active")
    $(this).addClass("active")
    $(".log-type-filter-container .log-type-select .select-btn .select-value").text($(this).find("p").text())
    filterLogs()
})

$(".search-container .search-input").on("input", filterLogs)

$(".log-type-select .select-btn").click(() => {
    $(".log-type-select").toggleClass("active")
})

const appendLogs = () => {
    $(".logs-container .log").remove()
    if(!window.logs || window.logs.length <= 0) {
        $(".no-logs").show()
        return;
    }
    window.logs.forEach((l) => {
        const category = categories[l.category]
        l.message = l.message.replace(/(\()/g, "<b>( ")
        l.message = l.message.replace(/(\))/g, " )</b>")
        $(".logs-container").append(`
            <div class="log">
                <div class="log-content">
                    <p class="log-type" style="background-color:${category.color};">${category.title}</p>
                    <div class="msg-info">
                        <p class="time">${moment(l.time).format("LLL")}</p>
                        <p class="message">${l.message}</p>
                    </div>
                </div>
            </div>
        `)
    })
}

const appendFilterMenu = () => {
    Object.keys(categories).forEach((c) => {
        c = categories[c]
        $(".log-type-filter-container .select-menu").append(`
            <div class="option">
                <p style="background-color:${c.color}">${c.title}</p>
            </div>
        `)
    })
}

$(document).ready(() => {
    window.logs = window.logs.sort((a, b) =>  b.time - a.time)
    appendFilterMenu()
    appendLogs()
})