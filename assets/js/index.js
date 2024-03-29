/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, sr, undefined) {
    "use strict";

    var $document = $(document),

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        debounce = function (func, threshold, execAsap) {
            var timeout;

            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap) {
                        func.apply(obj, args);
                    }
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                } else if (execAsap) {
                    func.apply(obj, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
            };
        };

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        function updateImageWidth() {
            var $this = $(this),
                contentWidth = $postContent.outerWidth(), // Width of the content
                imageWidth = this.naturalWidth; // Original image resolution

            if (imageWidth >= contentWidth) {
                $this.addClass('full-img');
            } else {
                $this.removeClass('full-img');
            }
        }

        var $img = $("img").on('load', updateImageWidth);
        function casperFullImg() {
            $img.each(updateImageWidth);
        }

        casperFullImg();
        $(window).smartresize(casperFullImg);

        $(".scroll-down").arctic_scroll();

    });

    // smartresize
    jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery, 'smartresize');

function styleCode() {
  if (typeof disableStyleCode != 'undefined') { return; }

  var a = false;

  $('pre').each(function() {
    if (!$(this).hasClass('prettyprint')) {
      $(this).addClass('prettyprint');
      a = true;
    }
  });

  if (a) { prettyPrint(); }
}

$(function() {styleCode();});



function readTime() {
  var word_minutes = $.map($('.post-content').find('p'), function(el) {
    return $(el).html().split(' ').length;
  }).reduce(function(a,b){ return a + b }, 0) / 275;

  var image_minutes = $.map($('.post-content').find('img'), function(el) {
    return 0.2;
  }).reduce(function(a,b){ return a + b }, 0);

  var code_minutes = $.map($('.post-content').find('pre code'), function(el) {
    return $(el).html().split(' ').length;
  }).reduce(function(a,b){ return a + b }, 0) / 275;


  return Math.ceil(word_minutes + image_minutes + code_minutes);
}

var readTime = readTime();
var plural = readTime == 1 ? "" : "s";

$('.read-time .minutes').html(readTime + " Minute" + plural);

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickFollowCta() {
  var ctas = [
    {
      id: 1,
      html: "<p><strong>PS:</strong> Let's be friends &ndash; <a href='http://twitter.com/allenan_'>follow me on Twitter!</a></p>"
    },
    {
      id: 2,
      html: "<p><strong>PS:</strong> If you found this helpful, <a href='http://twitter.com/allenan_'>you should follow me on Twitter</a> for more content like this.</p>"
    },
    {
      id: 3,
      html: "<p><strong>PS:</strong> If you found this helpful, you should follow me on Twitter <a href='http://twitter.com/allenan_'>here</a> for more content like this.</p>"
    },
    {
      id: 4,
      html: "<p><strong>PS:</strong> You should follow me on Twitter <a href='http://twitter.com/allenan_'>here</a> for more content like this.</p>"
    },
    {
      id: 5,
      html: "<p><strong>PS:</strong> You should follow me on Twitter <a href='http://twitter.com/allenan_'>here</a>.</p>"
    }
  ];

  return randomFrom(ctas);
}

var followCta = pickFollowCta();

$('.follow-cta').html(followCta.html).data('cta', followCta.id);

$('section.follow-cta a').click(function() {
  analytics.track('Twitter Follow', {
    location: 'Article CTA',
    variant: $('.follow-cta').data('cta')
  });
});

$('section.follow a').click(function() {
  analytics.track('Twitter Follow', {
    location: 'Article CTA'
  });
});

$('.main-nav .subscribe-button').click(function() {
  analytics.track('Twitter Follow', {
    location: 'Header'
  });
});

$('.author .icon-twitter a').click(function() {
  analytics.track('Twitter Follow', {
    location: 'Author'
  });
});

$('.share .icon-twitter').click(function() {
  analytics.track('Share Article', {
    via: 'Twitter'
  });
});

$('.share .icon-facebook').click(function() {
  analytics.track('Share Article', {
    via: 'Facebook'
  });
});

$('.share .icon-google-plus').click(function() {
  analytics.track('Share Article', {
    via: 'Google Plus'
  });
});
