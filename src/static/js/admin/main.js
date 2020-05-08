
$(".nav-container .nav-link-dropdown-container .nav-link-btn").click(function() {
  $(this).parents(".nav-link-dropdown-container").toggleClass("active")
})

$(document).on("click",function(e) {
    if($(e.target).hasClass(".nav-link-btn") || $(e.target).closest('.nav-link-btn').length || $(e.target).hasClass(".nav-link-dropdown-container") || $(e.target).closest('.nav-link-dropdown-container').length) return;
    $(".nav-link-dropdown-container").removeClass("active")
})

$(document).ready(() => {
    switch(window.location.pathname) {
        case "/admin/current-stream":
          $(".nav-container .current-streams-link").addClass("active")
          break;
        case "/admin/upcoming-streams":
          $(".nav-container .upcoming-streams-link").addClass("active")
          break;
        case "/admin/chat-moderation":
          $(".nav-container .chat-moderation-link").addClass("active")
          break;
        case "/admin/viewers":
          $(".nav-container .viewers-link").addClass("active")
          break;
        case "/admin/logs":
          $(".nav-container .logs-link").addClass("active")
          break;
        case "/admin/users":
          $(".nav-container .users-link").addClass("active")
          break;
    }
})