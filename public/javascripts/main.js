// import * as bootstrap from './bootstrap'
// const myCarouselElement = document.getElementById('#heroCarousel')

// new bootstrap.Carousel(myCarouselElement, {
//     interval: 50000,
//     touch: false,
//     ride: 'carousel',
// })

!(function ($) {
    'use strict'

    $(document).ready(function () {
        // Intro carousel
        var heroCarousel = $('#heroCarousel')
        var heroCarouselIndicators = $('#hero-carousel-indicators')
        heroCarousel
            .find('.carousel-inner')
            .children('.carousel-item')
            .each(function (index) {
                index === 0
                    ? heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>")
                    : heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>")
            })

        heroCarousel.on('slid.bs.carousel', function (e) {
            $(this).find('h2').addClass('animated fadeInDown')
            $(this).find('p').addClass('animated fadeInUp')
            $(this).find('.btn-get-started').addClass('animated fadeInUp')
        })
    })
})(jQuery)
