//HTML js code
const bookingSubmit = document.querySelector('.booking-submit')
const bookingCancel = document.querySelector('.booking-cancel')
const calendarDisplay = document.querySelector(".calendar")
const overallRating = document.getElementById('overall-rating')
const reviewFormSubmit = document.querySelector(".review-form-submit")
const reviewSection = document.querySelector('.review-section')
const viewCalendarBtn = document.querySelector('.change-calendar')
const viewedMonth = document.querySelector('#calendar-month-selection')

const createReviewTiles = (reviewInfo) => {
  const review = document.createElement('div')
  review.classList.add('review')

  review.innerHTML = `
    <div class="review-title">
      <h3>${reviewInfo.name}</h3>
      <div>Rating: ${reviewInfo.rating}/5</div>
    </div>
    <p class="review-info">Date experienced: ${reviewInfo.date}</p>
    <p class="review-info">${reviewInfo.note}</p>
    </div>
  `

  reviewSection.appendChild(review)
}

const displayReviews = (responseData) => {
  reviewSection.innerHTML = ``

  const {reviews, summedReviews} = responseData

  overallRating.textContent = `Our Overall Rating: ${summedReviews} / 5`

  reviews.forEach(review => {
    createReviewTiles(review)
  })
}

bookingCancel.addEventListener('click', () => {
  document.querySelector('#booking-form-name').value = ""
  document.querySelector('#booking-form-address').value = ""
  document.querySelector('#booking-form-date').value = ""
  document.querySelector('#booking-arrival-time').value = ""
  document.querySelector('#booking-end-time').value = ""
})

const createCalendar = (days, offset) => {
  while(calendarDisplay.firstChild){
    calendarDisplay.removeChild(calendarDisplay.firstChild)
  }

  for(let i = 0; i < offset; i++){
    const spacer = document.createElement('div')

    spacer.classList.add("calendar-spacer")

    calendarDisplay.appendChild(spacer)
  }

  for(let i = 1; i <= days; i++){
    const day = document.createElement('div')

    day.classList.add('days')

    day.innerHTML = `
      <p>${i}</p>
      <span class="day-schedule pending">Morning</span>
      <span class="day-schedule">Afternoon</span>
      <span class="day-schedule booked">Night</span>
    `

    calendarDisplay.appendChild(day)
  }
}

//Random js stuff
const restructureDate = (date) => {
  let splitDate = date.split('-')

  let year = splitDate[0]
  let month = splitDate[1]
  let day = splitDate[2]

  return `${month}/${day}/${year}`
}

//Server Requests
const baseURL = 'http://localhost:4567/api'

const bookUs = (event) => {
  event.preventDefault()

  let name = document.querySelector('#booking-form-name').value
  let address = document.querySelector('#booking-form-address').value
  let date = document.querySelector('#booking-form-date').value
  let arrival = document.querySelector('#booking-arrival-time').value
  let end = document.querySelector('#booking-end-time').value
  
  date = restructureDate(date)
  checkDate = new Date(date)

  if(name && address && date && arrival && end){
    if(checkDate > new Date() && checkDate.getDay() !== 0){
      const body = {
        name,
        address,
        date,
        arrival,
        end
      }

      // axios.post(`${baseURL}/booking`, body)
    
    } else {
      alert("Please select a valid date." + "\n\n" + "Date's before today and same day booking is not accepted." + "\n\n" + "We do not operate on Sundays" + "\n\n" + "Please call if you would like to book us for today!")
    }
  } else {
    alert("Please fill out entire form")
  }
}

const getBookings = () => {
  let calendarDate

  if(viewedMonth.value){
    calendarDate = viewedMonth.value
  } else {
    let tempDate = new Date()

    let year = tempDate.getFullYear()
    let month = tempDate.getMonth() + 1

    if(month < 10){
      month = '0' + month
    }
    
    calendarDate = `${year}-${month}`
  }

  axios.get(`${baseURL}/booking/${calendarDate}`)
  .then(res => {
    viewedMonth.value = res.data.date
    const date = new Date(res.data.date)
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    createCalendar(lastOfMonth.getDate(), firstOfMonth.getDay())
  })
}

const addReview = (event) => {
  event.preventDefault()

  let name = document.querySelector("#review-form-name")
  let date = document.querySelector("#review-form-date")
  let rating = document.querySelector("input[name='review-form-rating']:checked")
  let note = document.querySelector('#review-form-note')

  
  if(name && date && rating && note){
    const body = {
      name: name.value,
      date: restructureDate(date.value),
      rating: +rating.value,
      note: note.value
    }
  
    axios.post(`${baseURL}/reviews`, body)
    .then(res => {
      displayReviews(res.data)
    })
    .catch(err => console.log(err))

    name.value = ''
    date.value = ''
    rating.checked = false
    note.value = ''

    alert('Thank you for your review!')
  } else {
    alert('Please fill out all fields')
  }
}

const getReviews = () => {
  axios.get(`${baseURL}/reviews`)
  .then(res => {
    displayReviews(res.data)
  })
  .catch(err => {
    console.log(err)
  })
}

//functions
bookingSubmit.addEventListener('click', bookUs)

reviewFormSubmit.addEventListener('click', addReview)

viewCalendarBtn.addEventListener('click', getBookings)

getBookings()
getReviews()