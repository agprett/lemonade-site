const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT

const {getReviews, addReview, getBookings, scheduleBooking, seed} = require('./controller')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/', express.static(path.join(__dirname, '../client')))

app.post('/api/seed', seed)

app.get('/api/reviews', getReviews)
app.post('/api/reviews', addReview)

app.get('/api/booking/:date', getBookings)
app.post('/api/booking', scheduleBooking)

app.listen(SERVER_PORT, () => console.log(`Docked at port ${SERVER_PORT}`))