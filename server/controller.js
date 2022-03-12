const reviews = require('./reviews.json')
const bookings = require('./booking.json')

let reviewId = 3
let bookingId = 2

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
      id: reviewId,
      name,
      rating,
      date,
      note
    }

    reviews.unshift(newReview)

    let summedReviews = getOverallRating(reviews)

    res.status(200).send({reviews, summedReviews})
    reviewId++
  },

  scheduleBooking: (req, res) => {
    const {name, date, address, arrival, end} = req.body

    const newBooking = {
      id: bookingId,
      name,
      date,
      address,
      arrival,
      end,
      status: 'requested'
    }

    bookings.push(newBooking)

    res.sendStatus(200)
    bookingId++
  }
}