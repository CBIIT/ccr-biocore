$(function () {
    initEvents();
    getImages();
});

function initEvents() {
    $('#modal').on('hidden.bs.modal', function (e) {
        $(this).find(".modal-body, .modal-title").html("");
    });

    $(".showGallery").on('click keypress', function () {
        if (this.id == "core") {
            $("#pathwayGallery, #pathway .caption p,.pathway").removeClass("show");
            $("#pathway").parent().removeClass('active');
        } else {
            $("#coreGallery, #core .caption p, .core").removeClass("show");
            $("#core").parent().removeClass('active');
        }
        $(this).parent().addClass("active");
        $("#" + this.id + "Gallery, #" + this.id + " .caption p, ." + this.id).addClass("show");
    });

    $(".mobile-nav").on("change", function () {
        if (this.value.length > 0) window.location.href = this.value;
    });
}

function getImages() {
    $.ajax({
        url: "images.json"
    }).done(function (data) {
        buildGalleryRows(data.core, "#coreGallery", "core");
        buildGalleryRows(data.pw, "#pathwayGallery", "pathway");
        if (!Galleria) {
            $(".prev, .next ").on("click", function () {
                var activeGallery = $("#coreGallery, #pathwayGallery").has(".show");
                var currentImg = activeGallery.find(".imagePreview img")[0];
                var tn = $("img[name='" + currentImg.name + "']").not(currentImg);

                var imgCount = activeGallery.find("img.img-thumbnail").length;
                var imgIndex = activeGallery.find("img.img-thumbnail").index(tn);

                if ($(this).hasClass("prev") && imgIndex > 0)
                    $(activeGallery.find("a.expand")[imgIndex - 1]).trigger("click");
                if ($(this).hasClass("next") && imgIndex != imgCount)
                    $(activeGallery.find("a.expand")[imgIndex + 1]).trigger("click");
            });
        }
    }).fail(function (jqXHR, textStatus) {
        $("#coreGallery, #pathwayGallery").append("<div class='alert alert-warning'>Cannot retrieve images. Try again later &hellip;</div>");

    });
}

function buildGalleryRows(items, containerElement, imgGroupName) {
    if (items.length <= 0) {
        $(containerElement).append("<div class='alert alert-warning'>Cannot retrieve images. Try again later.</div>");
    } else {

        var imagesArray = [];

        for (var i = 0; i < items.length; i++) {
            var imageObject = {
                thumb: null,
                image: null,
                big: null,
                title: null,
                description: null
            };

            imageObject.thumb = items[i][0];
            imageObject.big = items[i][1];
            imageObject.image = items[i][2];
            imageObject.title = imageObject.image.split(".")[1];
            imageObject.description = imageObject.image.split(".")[1] + " " + imgGroupName;

            imagesArray.push(imageObject);
        }

        if (imagesArray.length > 0) {

        $(containerElement).before("<a href='images/" + imgGroupName.capitalize() +
            "_heatmaps.zip' class='download btn btn-lg btn-primary " + imgGroupName + "'><span class='glyphicon glyphicon-download'></span> Download " + imgGroupName.capitalize() + " Heatmaps</a>");
            if (Galleria) {
//                Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.4.2/themes/classic/galleria.classic.js');
                mobile = isMobileBrowser();
                Galleria.loadTheme('ccrbcTheme/galleria.ccrbc.js');
                Galleria.configure({
                    wait: true,
                    width: '100%',
                    height: '0.9',
                    responsive: mobile,
                    dummy: "../images/loader.gif",
                    thumbPosition: "top center",
                    idleMode: false,
                    lightbox: true,
                    opacityOverlay: 0.65,
                    preload: 10
                });

                Galleria.run(containerElement, {
                    dataSource: imagesArray
                });
            }
            else {
                // fallback if galleria does not load
                $(containerElement).append("<div class='row'><div id='" + imgGroupName + "Preview' class='imagePreview'></div></div><div class='row'><button type='button' class='prev col-sm-2 pull-left'><span class='glyphicon glyphicon-arrow-left'></span></button><span class='imgIndex'></span><button type='button' class='next col-sm-2 pull-right'><span class='glyphicon glyphicon-arrow-right'></span></button></div><div class='row'></div>");

                for (var i = 0; i < items.length; i++) {
                    if (i > 0 && (i % 6 === 0)) {
                        $(containerElement).append("<div class='row'></div>");
                    }

                    var rowIndex = $(containerElement + " .row").length - 1;
                    var galleryRow = $(containerElement + " .row")[rowIndex];

                    var tn_filename = items[i][0];
                    var fs_filename = items[i][1];

                    var imgTitle = tn_filename.split(".")[1] + " " + imgGroupName;
                    var imgName = imgTitle.replace(" ", "_").toLowerCase();

                    var img = new Image();
                    img.src = tn_filename;

                    $(galleryRow).append("<div class='col-sm-4 col-md-2'>" +
                        tn_filename.split(".")[1] + "<a class='expand' href='#'>" +
                        "<img class='img-thumbnail' name='" + imgName + "' src='" +
                        tn_filename + "' data-zoom-image='" + fs_filename + "' alt='" +
                        imgTitle + " heatmap' />" + "<span class='glyphicon glyphicon-fullscreen'>" + "</span></a></div>");

                    $(containerElement).find("a.expand").on("click", function () {
                        var img = $(this).find("img").clone();

                        $("#" + imgGroupName + "Preview").html("").addClass("show");
                        $("#" + imgGroupName + "Preview").html(img);

                        document.getElementsByClassName("imagePreview")[0].scrollIntoView();

                        if (isMobileBrowser()) {
                            $("#" + imgGroupName + "Preview img").attr("src", $(this).find("img").attr("data-zoom-image"));
                        } else {
                            $("#" + imgGroupName + "Preview img").elevateZoom();
                        }
                    });
                }
            }
        }
    }
}

function isMobileBrowser() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
};
