const express = require('express')
const cors = require('cors')
require('dotenv').config()

const {SERVER_PORT} = process.env

const {getReviews, addReview, scheduleBooking} = require('./controller')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/api/reviews', getReviews)
app.post('/api/reviews', addReview)

app.post('/api/booking', scheduleBooking)

app.listen(SERVER_PORT, () => console.log(`Docked at port ${SERVER_PORT}`))