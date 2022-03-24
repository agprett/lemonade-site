// const reviews = require('./reviews.json')
const bookings = require('./booking.json')
const bookingInfo = require('./booking-info.json')

let reviewId = 3
let bookingId = 4
let bookingInfoId = 4

const Sequelize = require('sequelize')
const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
        rejectUnauthorized: false
    }
  }
})

const getOverallRating = (reviewsInfo) => {
  let summedReviews = reviewsInfo.reduce((acc, curr) => acc + curr.rating, 0)

  summedReviews = (summedReviews / reviewsInfo.length).toFixed(1)

  return summedReviews
}

module.exports = {
  getReviews: (req, res) => {
    sequelize.query(`SELECT * FROM reviews ORDER BY date DESC LIMIT 20;`)
    .then(dbRes => {
      // console.log(dbRes[0])
      let reviews = dbRes[0]
      let summedReviews = getOverallRating(reviews)

      res.status(200).send({reviews, summedReviews})
    })
    .catch((err) => console.log(err))
  },

  addReview: (req, res) => {
    const {name, rating, date, note} = req.body

    sequelize.query(`INSERT INTO reviews (name, rating, date, note)
      VALUES ('${name}', ${rating}, '${date}', '${note}');

      SELECT * FROM reviews ORDER BY date DESC LIMIT 20;
    `)
    .then(dbRes => {
      let reviews = dbRes[0]
      let summedReviews = getOverallRating(reviews)
  
      res.status(200).send({reviews, summedReviews})
    })
    .catch(err => console.log(err))
  },

  getBookings: (req, res) => {
    const {date} = req.params

    const viewedDate = new Date(`'${date}'`)

    let pendingDates = {}
    let bookedDates = {}
    
    sequelize.query(`SELECT times, date, status FROM bookings
    WHERE (SELECT (DATE '${viewedDate.toISOString()}', INTERVAL '1 month') OVERLAPS (date, INTERVAL '1 day'));
    
    `)
    .then(dbRes => {
      let responseArray = dbRes[0]
  
      responseArray.forEach(booking => {
        let tempDay = (new Date(booking.date).getDate()) + 1
  
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
    })
    .catch(err => console.log(err))
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
      sequelize.query(`INSERT INTO bookings (name, address, times, date, status)
        VALUES ('${name}', '${address}', '${times}', '${date}', 'pending');
        `)
        .then(() => res.status(200).send('Booked successfully!'))
        .catch(err => console.log(err))
    } else {
      res.sendStatus(400)
    }
  }
}