$(window).scroll(function(){
    if ($(window).scrollTop() >= 200) {
       $('nav').addClass('fixed-header');
    }
    else {
       $('nav').removeClass('fixed-header');
    }
});