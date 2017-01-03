
/* ================================================
 TABLE OF CONTENTS
 ------------------------------------------------
     1. OWL Carousel
     2. Timers
     3. Parallax
     4. Isotope Filtering
     5. Magnific popup call
     6. Smooth Scroll
     7. Touch Hover
     8. Preloader
     9. #intro Height
     10. fitVids init
     11. Wow init


 ================================================  */



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        /* 1.OWL Carousel  */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//intro carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-intro");

    owl.owlCarousel({
        // Most important owl features
        autoPlay: 3000,
        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [980,1],
        itemsTablet: [768,1],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        singleItem : true,
        itemsScaleUp : true,
        navigation:	false,
        pagination:	false,
        transitionStyle : "backSlide"


    });

});

//about intro text carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-about");

    owl.owlCarousel({
        // Most important owl features
        autoPlay: 3000,
        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [980,1],
        itemsTablet: [768,1],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        singleItem : true,
        itemsScaleUp : true,
        navigation:	false,
        pagination:	false,
        transitionStyle : "backSlide"

    });

    // Custom Navigation Events
    $(".next").click(function(){
        owl.trigger('owl.next');
    })
    $(".prev").click(function(){
        owl.trigger('owl.prev');
    })
});

//team carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-team");

    owl.owlCarousel({
        // Most important owl features
        autoPlay: 3000,
        items : 4,
        itemsCustom : false,
        itemsDesktop : [1199,4],
        itemsDesktopSmall : [980,3],
        itemsTablet: [768,2],
        itemsMobile : [479,1],
        pagination:false,
        navigation: true,
        navigationText: [
            "<i class='fa fa-angle-left fa-4x'></i>",
            "<i class='fa fa-angle-right fa-4x'></i>"
        ]

    });



});

//clients carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-clients");

    owl.owlCarousel({
        pagination:false
    });

    // Custom Navigation Events
    $("#clients .next").click(function(){
        owl.trigger('owl.next');
    })
    $("#clients .prev").click(function(){
        owl.trigger('owl.prev');
    })

});

//testimonials carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-testimonials");

    owl.owlCarousel({
        // Most important owl features
        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [980,1],
        itemsTablet: [768,1],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        singleItem : false,
        itemsScaleUp : false,
    });

    $("#testimonials .customPagination").click(function(){
        owl.trigger('owl.pagination');
    });

    // Custom Navigation Events
    $("#testimonials .next").click(function(){
        owl.trigger('owl.next');
    });
    $("#testimonials .prev").click(function(){
        owl.trigger('owl.prev');
    })

});

//recent news carousel
$(document).ready(function() {
    "use strict";
    var owl = $("#owl-blogPost");

    owl.owlCarousel({
        // Most important owl features
        items : 1,
        singleItem : true,
        itemsScaleUp : false,
        pagination: true,
        navigation: true,
        navigationText: [
            "<i class='fa fa-angle-left fa-4x'></i>",
            "<i class='fa fa-angle-right fa-4x'></i>"
        ]
    });



});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            /* 2. TIMERS */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$('#charts').waypoint(function() {
    "use strict";
    // first timer
    $('.timer1').countTo({

        from: 0, // the number you want to start
        to: 250, // the number you want to reach
        speed: 250,
        refreshInterval: 1,
        onComplete: function(value) {
            $( '.timer' ).stop();
        }

    });

    // second timer
    $('.timer2').countTo({

        from: 0,// the number you want to start
        to: 70,// the number you want to reach
        speed: 250,
        refreshInterval: 1,
        onComplete: function(value) {
            $( '.timer' ).stop();
        }

    });


    // third timer
    $('.timer3').countTo({

        from: 0,// the number you want to start
        to: 120,// the number you want to reach
        speed: 250,
        refreshInterval: 1,
        onComplete: function(value) {
            $( '.timer' ).stop();
        }

    });


    // fourth timer
    $('.timer4').countTo({

        from: 0,// the number you want to start
        to: 101,// the number you want to reach
        speed: 250,
        refreshInterval: 1,
        onComplete: function(value) {
            $( '.timer' ).stop();
        }

    });


}, { offset: 500 });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /* 3. PARALLAX SECTIONS INIT*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// make sure you have a backgorund set on the div where you want to use parallax
$(document).ready(function(){
    "use strict";
    $('#clients').parallax("50%", 0.1);
    $('#testimonials').parallax("50%", 0.1);
    $('#charts').parallax("100%", 0.3);
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  /* 4. ISOTOPE GALLERY FILTERING*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(document).ready(function(){
    "use strict";
    //init Isotope
    var $container = $('.gallery').imagesLoaded( function() {
        $container.isotope({
            // options
        });
    });


    $('#filters').on( 'click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
    });

    $container.isotope({
        filter: '*' // IF YOU WANT TO DISPLAY AT FIRST ONLY ONE FILTER, FOR EXAMPLE DESIGNS: SUBSTIUTE '*' WITH '.designs'
    });


});

$(document).ready(function(){
    "use strict";
    //init Isotope
    var $container = $('.recentPosts').imagesLoaded( function() {
        $container.isotope({
            // options
        });
    });


});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /* 5. MAGNIFIC POPUP CALL */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


$(document).ready(function(){
    "use strict";
    $('.gallery-inner').magnificPopup({
        delegate: ' .popup-link',
        gallery: {
            enabled: true, // set to true to enable gallery

            navigateByImgClick: true,

            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

            tPrev: 'Previous (Left arrow key)', // title for left button
            tNext: 'Next (Right arrow key)', // title for right button

        },
        type: 'image',
        mainClass: 'mfp-fade',
        // Info about options is in docs:
        // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

        tLoading: 'Loading...'
    });
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        /* 6.SMOOTH SCROLL */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(function() {
    "use strict";
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 50
                }, 2500);
                return false;
            }
        }
    });
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        /* 7.Touch hover */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$('.gallery-inner').bind('touchstart', function() {
    $(this).addClass('.caption');
});

$('.gallery-inner').bind('touchend', function() {
    $(this).removeClass('.caption');
});



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
         /*  8. PRELOADER*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


$(window).load(function() {    // makes sure the whole site is loaded
    "use strict";
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow':'visible'});
})


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
       /* 9. SET #INTRO HEIGHT*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(document).ready(function () {
    function introHeight() {

        wh = $(window).height()+20;
        $('#intro').css({height: wh});
    }

    introHeight();

    $(window).bind('resize',function () {
        "use strict";
        //Update slider height on resize
        introHeight();
    });
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
     /* 10. fitVids init */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(document).ready(function(){
    "use strict";
    // Target your .container, .wrapper, .post, etc.
    $("body").fitVids();
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
         /* 11. Wow int */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// plugin to trigger animations on scroll
var wow = new WOW(
    {
        boxClass:     'wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       150,          // distance to the element when triggering the animation (default is 0)
        mobile:       false        // trigger animations on mobile devices (true is default)
    }
);
wow.init();
