const reviews = require('./db.json')

const getOverallRating = (reviewsInfo) => {
  let summedReviews = reviewsInfo.reduce((acc, curr) => acc + curr.rating, 0)

  summedReviews = (summedReviews / reviewsInfo.length).toFixed(1)

  return summedReviews
}

module.exports = {
  getReviews: (req, res) => {
    let summedReviews = getOverallRating(reviews)

    res.status(200).send({reviews, summedReviews})
  },

  addReview: (req, res) => {
    const {name, rating, date, note} = req.body

    const newReview = {
      name,
      rating,
      date,
      note
    }

    reviews.unshift(newReview)

    let summedReviews = getOverallRating(reviews)

    res.status(200).send({reviews, summedReviews})
  }
}