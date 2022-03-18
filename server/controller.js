const reviews = require('./reviews.json')
const bookings = require('./booking.json')
const bookingInfo = require('./booking-info.json')

let reviewId = 3
let bookingId = 4
let bookingInfoId = 4

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

  getBookings: (req, res) => {
    const {date} = req.params

    const viewedDate = new Date(`'${date}'`)

    let filteredArray = bookingInfo.filter(booking => {
      const bookedDate = new Date(booking.date)
      return viewedDate.getMonth() === bookedDate.getMonth()
    })

    let pendingDates = {}
    let bookedDates = {}

    filteredArray.forEach(booking => {
      let tempDay = new Date(booking.date).getDate()

      if(booking.status == 'pending'){
        if(pendingDates[tempDay]) {
          pendingDates[tempDay] = [...booking.times, ...pendingDates[tempDay]]
        } else {
          pendingDates[tempDay] = booking.times
        }
      } else {
        if(bookedDates[tempDay]) {
          bookedDates[tempDay] = [...booking.times, ...bookedDates[tempDay]]
        } else {
          bookedDates[tempDay] = booking.times
        }
        
      }
    })

    res.status(200).send({date, bookedDates, pendingDates})
  },

  scheduleBooking: (req, res) => {
    const {name, address, date, times} = req.body

    let goodToGo = true

    bookingInfo.forEach(bookedInfo => {
      if(bookedInfo.date === date){
        times.forEach(time => {
          if(bookedInfo.times.includes(time)){
            goodToGo = false
          }
        })
      }
    })

    if(goodToGo){
      const newBooking = {
        id: bookingId,
        name,
        address,
        "booked-time": bookingInfoId
      }
  
      const newBookingInfo = {
        id: bookingInfoId,
        times,
        date,
        status: 'pending'
      }
  
      bookings.push(newBooking)
      bookingInfo.push(newBookingInfo)
  
      res.status(200).send('Booked successfully!')
      bookingId++
      bookingInfoId++
    } else {
      res.sendStatus(400)
    }
  }
}