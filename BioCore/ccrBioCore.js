$(function () {
    getImages();
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

        $("#coreGallery").prepend("<a href='images/Core_heatmaps.zip' class='download btn btn-default'><span class='glyphicon glyphicon-download'></span> Download Core Heatmaps</a");
        $("#pathwayGallery").prepend("<a href='images/Pathway_heatmaps.zip' class='download btn btn-default'><span class='glyphicon glyphicon-download'></span> Download Pathway Heatmaps</a");

        $("a.expand").on("click", function () {
            var fullSize = $(this).find("img").attr("data-full-img");
            $("#modal .modal-title").html($(this).find("img").attr('name'));
            $("#modal .modal-body").append("<img id='fullImage' class='img-thumbnail' src='" + fullSize + "' />");

            $("img#fullImage").loupe({
                loupe: "magnify",
                height: 150,
                width: 300
            });
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
            $(galleryRow).append("<div class='col-sm-4 col-md-2'>" + items[0][i][0].split(".")[1] + "<a class='expand' href='#'><img class='img-thumbnail' name='" + items[0][i][0].split(".")[1] + "' src='" +
                items[0][i][0] + "' data-full-img='" + items[0][i][1] + "'/><span class='glyphicon glyphicon-fullscreen'></span></a></div>");
        }
    }
}
