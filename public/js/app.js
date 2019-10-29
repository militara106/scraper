$(document).on("click", ".savenote", function () {
    var thisId = $(this).attr("data-id");
    console.log($("#commentBody" + thisId).val());
    $.ajax({
            method: "POST",
            url: "/Topics/" + thisId,
            data: {
                body: $("#commentBody" + thisId).val()
            }
        })
        .then(function (data) {
            console.log(data);
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#commentBody" + thisId).val("");
});