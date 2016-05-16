$(function () {
    getImages();
    $('#modal').on('hidden.bs.modal', function (e) {
        $(this).find(".modal-body").html();
    });

    $(".thumbnail a").hover(function () {
        $(this).find(".caption p").addClass("show");

    }, function () {
        $(this).find(".caption p").removeClass("show");
    });

    $(".showGallery").on('click keypress', function () {
        if (this.id == "core")
            $("#pathwayGallery").removeClass("show");
        else
            $("#coreGallery").removeClass("show");

        $("#" + this.id + "Gallery").addClass("show");
    });
});

function getImages() {
    $("#coreGallery, #pathwayGallery").empty();

    $.when($.ajax({
        url: "core.json"
    }), $.ajax({
        url: "pw.json"
    })).done(function (coreImages, pwImages) {
        buildGalleryRows(coreImages, "#coreGallery");
        buildGalleryRows(pwImages, "#pathwayGallery");

        $("a.expand").on("click", function () {
            var fullSize = $(this).find("img").attr("data-full-img");
            $("#modal .modal-body").append("<img class='img-thumbnail' src='" + fullSize + "' />");
            $("#modal").modal('show');
        });
    });
}

function buildGalleryRows(items, containerElement) {
    if (items.length <= 0) {
        $(containerElement).append("<div class='alert alert-warning'>Cannot retrieve images. Try again later.</div>");
    } else {
        $(containerElement).append("<div class='row'></div>");
        for (var i = 0; i < items[0].length; i++) {
            if (i > 0 && (i % 6 === 0)) {
                $(containerElement).append("<div class='row'></div>");
            }
            var rowIndex = $(containerElement + " .row").length - 1;
            var galleryRow = $(containerElement + " .row")[rowIndex];
            $(galleryRow).append("<div class='col-sm-2'><a class='expand' href='#'><img class='img-thumbnail' src='" +
                items[0][i][0] + "' data-full-img='" + items[0][i][1] + "'/><span class='glyphicon glyphicon-fullscreen'></span></a></div>");
        }
    }
}
