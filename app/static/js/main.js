
function filterData() {
    d3.event.preventDefault();

    d3.select("#startDate").property("value")

    d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
    .header("holes", 19)
    .get(function(error, data) {
        console.log(data);
    })

}


d3.select("#filter-btn").on("click", filterData);