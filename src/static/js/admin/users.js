
const filterUsers = () => {
    const users = $(".users-container .user")
    users.each(function() {
        const e = $(this)
        if(searchUsers(e) && applyGradeFilter(e) && applyBannedFilter(e)) {
            e.removeClass('hidden')
        } else {
            e.addClass('hidden')
        }
    })

    if($('.users-container .user:not(.hidden)').length <= 0 ) {
        $(".users-container .no-users").show()
    } else {
        $(".users-container .no-users").hide()
    }
}

const searchUsers = (e) => {
    const val = $(".search-container .search-input").val().toLowerCase()
    if(val.trim().length <= 0) {
        return true;
    }
    const name = e.find(".user-name ").text().toLowerCase()
    const firstName = name.split(" ")[0]
    const lastName = name.split(" ")[1]
    const email = e.find(".user-email").text().toLowerCase()
    if(email.startsWith(val) || firstName.startsWith(val) || lastName.startsWith(val) || name.startsWith(val)) {
        return true;
    } else {
        return false;
    }
}

const applyGradeFilter = (e) => {
    const grade = "" + $('.grade-option.active').data("grade")
    if(grade==="all") {
        return true;
    }
    if(e.find(".grade-info .value").text().toLowerCase() === grade) {
        return true;
    } else {
        return false;
    }
}

const applyBannedFilter = (e) => {
    const banned = "" + $('.banned-option.active').data("banned")
    if(banned==="all") {
        return true;
    }
    if(e.find(".banned-info .value").text().toLowerCase() === banned) {
        return true;
    } else {
        return false;
    }
}

$(".search-container .search-input").on('input', filterUsers)

$(".search-container .grade-select .grade-option").click(function() {
    if($(this).hasClass("active")) {
        return;
    }
    $(".search-container .grade-select .grade-option").removeClass('active')
    $(this).addClass('active') 
    filterUsers()
})

$(".search-container .banned-select .banned-option").click(function() {
    if($(this).hasClass("active")) {
        return;
    }
    $(".search-container .banned-select .banned-option").removeClass('active')
    $(this).addClass('active') 
    filterUsers()
})

const appendUsers = () => {
    $(".users-container .user").remove()
    if(!window.users || window.users.length <= 0) {
        $(".viewers-table .no-viewers").show()
        return;
    }
    window.users.forEach((u) => {
        const authorized =  u.auth > 0
        const fullName = 
            u.firstName[0].toUpperCase() + u.firstName.slice(1) + " " +
            u.lastName[0].toUpperCase() + u.lastName.slice(1);
        $(".users-container").append(`
            <div class="user" data-google-id="${u.googleId}">
                <div class="user-picture" style="background-image:url(${u.googleProfilePicture});"></div>
                <h1 class="user-name">${fullName}</h1>
                <p class="user-email">${u.email}</p>
                <div class="basic-info-container">
                    <div class="grade-info info">
                        <p class="label">Grade</p>
                        <h2 class="value">${u.grade === 0 ? "None" : u.grade}</h2>
                    </div>
                    <div class="banned-info info">
                        <p class="label">Banned</p>
                        <h2 class="value">${u.banned ? "Yes" : "No"}</h2>
                    </div>
                </div>
                <button class="auth-btn" data-action="${authorized ? "unauthorize" : "authorize"}">${authorized ? "Unauthorize" : "Authorize"} User</button>
                <button class="ban-btn" data-action="${u.banned ? "unban" : "ban"}">${u.banned ? "Unban" : "Ban"} User</button>
        </div>
        `) 
    })
}

$(document).ready(() => {
    appendUsers()
})

$(() => { // BAN CODE
    $(document).on("click", ".users-container .user .ban-btn", function() {
        const data = {
            googleId: $(this).parents(".user").data("google-id")
        }
        if($(this).attr("data-action") === "ban") {
            $.post({
                url: "/admin/api/banUser",
                data: data,
                success: () => {
                    window.location.reload()
                }
            })
        } else {
            $.post({
                url: "/admin/api/unbanUser",
                data: data,
                success: () => {
                    window.location.reload()
                }
            })
        }
    })
    $(document).on("click", ".users-container .user .auth-btn", function() {
        let setAuth = 0
        if($(this).attr('data-action') == "authorize") {setAuth = 1}
        if($(this).attr('data-action') == "unauthorize") {setAuth = 0}
        const data = {
            googleId: $(this).parents(".user").data("google-id"),
            auth: setAuth
        }
        $.post({
            url: "/admin/api/userAuth",
            data: data,
            success: () => {
                window.location.reload()
            }
        })
    })
})