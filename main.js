$(".git-button").hover(
  function() {
    $(this).addClass("btn-github");
  },
  function() {
    $(this).removeClass("btn-github")
  }
);

$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});