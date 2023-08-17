function average(review) {
    let averageR = 0;
    for (rating of review) {
        averageR += rating;
    }
    return averageR / rating.length;
}