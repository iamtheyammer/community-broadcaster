
$(document).ready(() => {
    switch(window.location.pathname) {
        case "/admin/current-stream":
          $(".nav-container .current-streams-link").addClass("active")
          break;
        case "/admin/upcoming-streams":
          $(".nav-container .upcoming-streams-link").addClass("active")
          break;
        case "/admin/viewers":
          $(".nav-container .viewers-link").addClass("active")
          break;
      }
})