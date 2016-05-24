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
            $("#pathwayGallery, #pathway .caption p").removeClass("show");
            $("#pathway").parent().removeClass('active');
        } else {
            $("#coreGallery, #core .caption p").removeClass("show");
            $("#core").parent().removeClass('active');
        }
        $(this).parent().addClass("active");
        $("#" + this.id + "Gallery, #" + this.id + " .caption p").addClass("show");
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
    });
}

function buildGalleryRows(items, containerElement, imgGroupName) {
    if (items.length <= 0) {
        $(containerElement).append("<div class='alert alert-warning'>Cannot retrieve images. Try again later.</div>");
    } else {
        $(containerElement).append("<div id='" + imgGroupName + "Preview' class='imagePreview'></div><div class='row'></div>");

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

                document.getElementById(imgGroupName + "Preview").scrollIntoView();

                if (isMobileBrowser) {
                    $("#" + imgGroupName + "Preview img").elevateZoom();
                }
            });
        }

        $(containerElement).prepend("<a href='images/" + imgGroupName.capitalize() +
            "_heatmaps.zip' class='download btn btn-default'><span class='glyphicon glyphicon-download'></span> Download  " + imgGroupName.capitalize() + " Heatmaps</a>");

    }
}

function isMobileBrowser() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

function callbackFunction(_callback, params) {
    if (params)
        _callback(params);
    else
        _callback();
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
};
