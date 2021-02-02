


d3.json("/api/v1/FeatureAggregate?feature=holes&aggregate=mean")
.header("holes", 19)
.get(function(error, data) {
    console.log(data);
})



