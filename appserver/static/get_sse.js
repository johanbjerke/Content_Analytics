$("#button").html($("<button class=\"btn btn-primary\">Pull the JSON</button>").click(function() {
    var results = $('<table class="table table-chrome"><thead><tr><th>Name</th><th>Status</th><th>Splunk Start Date</th></tr></thead><tbody></tbody></table>')
    var Items = []
    $.ajax({ url: '/static/app/SA-devforall/ex17-reading-JSON-files/example_data.json', async: false, success: function(returneddata) { Items = returneddata } });
    // console.log("Got these Items", Items)
    for (var i = 0; i < Items.length; i++) {
        results.find("tbody").append('<tr><td>' + Items[i].Name + '</td><td>' + Items[i].Status + '</td><td>' + Items[i].Splunk_Start_Date + '</td></tr>')
    }
    $("#result").html(results)
}))