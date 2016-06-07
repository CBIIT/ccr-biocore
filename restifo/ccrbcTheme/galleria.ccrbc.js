(function ($) {

    Galleria.addTheme({
        name: 'ccrbc',
        author: '',
        css: 'galleria.ccrbc.css',
        defaults: {
            transition: 'slide',
            thumbCrop: 'height',

            // set this to false if you want to show the caption all the time:
            _toggleInfo: true
        },
        init: function (options) {

            Galleria.requires(1.4, 'This version of Classic theme requires Galleria 1.4 or later');

            thisGallery = this;

            $.each(thisGallery._thumbnails, function(i, tn){
                tn.image.alt = thisGallery.getData(i).title;
            });

            // add some elements
            this.addElement('info-link', 'info-close');

            this.appendChild("info-link", "<button id='image-info' type='button' aria-label='image details'><span class='glyphicon glyphicon-info-sign'></span></button>");
            this.appendChild("image-nav-left", "<button type='button' aria-label='previous-image'><span class='glyphicon glyphicon-chevron-left'></span></button>");
            this.appendChild("image-nav-right", "<button type='button' aria-label='next imwge'><span class='glyphicon glyphicon-chevron-right'></span></button>");
            this.appendChild("thumb-nav-left", "<button type='button' aria-label='more thumbnails to left'><span class='glyphicon glyphicon-chevron-left'></span></button>")
            this.appendChild("thumb-nav-right", "<button type='button' aria-label='more thumbnails to right'><span class='glyphicon glyphicon-chevron-right'></span></button>");
            this.appendChild("lightbox-prev", "<button type='button' aria-label='previous image'><span class='glyphicon glyphicon-chevron-left'></span></button>")
            this.appendChild("lightbox-next", "<button type='button' aria-label='next image'><span class='glyphicon glyphicon-chevron-right'></span></button>");
            this.appendChild("info-close", "<button type='button' aria-label='close'><span>&times;</span></button>");

            this.append({
                'info': ['info-link', 'info-close']
            });

            // cache some stuff
            var info = this.$('info-link,info-close,info-text'),
                touch = Galleria.TOUCH;

            // show loader & counter with opacity
            this.$('loader,counter').show().css('opacity', 0.4);

            // some stuff for non-touch browsers
            if (!touch) {
                this.addIdleState(this.get('image-nav-left'), {
                    left: -50
                });
                this.addIdleState(this.get('image-nav-right'), {
                    right: -50
                });
                this.addIdleState(this.get('counter'), {
                    opacity: 0
                });
            }

            // toggle info
            if (options._toggleInfo === true) {
                info.bind('click:fast', function () {
                    info.toggle();
                });
            } else {
                info.show();
                this.$('info-link, info-close').hide();
            }

            var activate = function (e) {
                $(e.thumbTarget).css('opacity', 1).parent().siblings().children().css('opacity', 0.6);
            };

            // bind keyboard navigation event handlers
            this.attachKeyboard({
                left: this.prev,
                right: this.next,
                up: this.next,
                down: this.prev,
                return: this.openLightbox,
                73: function () {
                    // i key pressed
                    $("button#image-info").trigger('click');
                }
            });

            this.bind('thumbnail', function (e) {
                if (!touch) {
                    // fade thumbnails on hover
                    $(e.thumbTarget).css('opacity', 0.6).parent().hover(function () {
                        $(this).not('.active').children().stop().fadeTo(100, 1);
                    }, function () {
                        $(this).not('.active').children().stop().fadeTo(400, 0.6);
                    });

                    if (e.index === this.getIndex()) {
                        $(e.thumbTarget).css('opacity', 1);
                    }
                } else {
                    $(e.thumbTarget).css('opacity', this.getIndex() ? 1 : 0.6).bind('click:fast', function () {
                        $(this).css('opacity', 1).parent().siblings().children().css('opacity', 0.6);
                    });
                }
            });

            this.bind('loadstart', function (e) {
                if (!e.cached) {
                    this.$('loader').show().fadeTo(200, 0.4);
                }
                window.setTimeout(function () {
                    activate(e);
                }, touch ? 300 : 0);
                this.$('info').toggle(this.hasInfo());
            });

            this.bind('loadfinish', function (e) {
                if (e.imageTarget)
                    $(e.imageTarget).attr("alt", e.galleriaData.title);
                if (e.thumbTarget)
                    $(e.thumbTarget).attr("alt", e.galleriaData.title);
                this.$('loader').fadeOut(200);
            });

            if(options.responsive) {
                this.setOptions('height', 1.5);
                this.setOptions('touchTransition', 'slide');
                this.$('counter, image-nav, thumb-nav-left,thumb-nav-right').hide();
            }
        }
    });

}(jQuery));
