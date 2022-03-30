//HTML js code
const bookingSubmit = document.querySelector('.booking-submit')
const bookingCancel = document.querySelector('.booking-cancel')
const calendarDisplay = document.querySelector(".calendar")
const overallRating = document.getElementById('overall-rating')
const reviewFormSubmit = document.querySelector(".review-form-submit")
const reviewSection = document.querySelector('.review-section')
const viewCalendarBtn = document.querySelector('.change-calendar')
const viewedMonth = document.querySelector('#calendar-month-selection')
const mediaLinks = document.querySelectorAll('.footer-links')

const createReviewTiles = (reviewInfo) => {
  const review = document.createElement('div')
  review.classList.add('review')

  const redoneDate = restructureDate(reviewInfo.date)

  review.innerHTML = `
    <div class="review-title">
      <h3>${reviewInfo.name}</h3>
      <div>Rating: ${reviewInfo.rating}/5</div>
    </div>
    <p class="review-info">Date experienced: ${redoneDate}</p>
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

const clearBookingForm = (event) => {
  if(event){
    event.preventDefault()
  }

  document.querySelector('#booking-form-name').value = ""
  document.querySelector('#booking-form-address').value = ""
  document.querySelector('#booking-form-date').value = ""
  document.querySelectorAll('.booking-blocks-selection:checked').forEach(box => {
    box.checked = false
  })
}

bookingCancel.addEventListener('click', clearBookingForm)

const createCalendar = (days, offset, pendingDates, bookedDates) => {
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

    const morning = document.createElement('span')
    morning.textContent = 'Morning'
    morning.classList.add('day-schedule')
    
    const afternoon = document.createElement('span')
    afternoon.textContent = 'Afternoon'
    afternoon.classList.add('day-schedule')
    
    const night = document.createElement('span')
    night.textContent = 'Night'
    night.classList.add('day-schedule')

    if(pendingDates[i]){
      if(pendingDates[i].includes('Morning')){
        morning.classList.add('pending')
      }
      if(pendingDates[i].includes('Afternoon')){
        afternoon.classList.add('pending')
      }
      if(pendingDates[i].includes('Night')){
        night.classList.add('pending')
      }
    }

    if(bookedDates[i]){
      if(bookedDates[i].includes('Morning')){
        morning.classList.add('booked')
      }
      if(bookedDates[i].includes('Afternoon')){
        afternoon.classList.add('booked')
      }
      if(bookedDates[i].includes('Night')){
        night.classList.add('booked')
      }
    }

    day.innerHTML = `<p>${i}</p>`

    day.appendChild(morning)
    day.appendChild(afternoon)
    day.appendChild(night)

    calendarDisplay.appendChild(day)
  }
}

const displayLegalAlert = (site) => {
  alert(`This is not a real business.\nOtherwise, this would have taken you to our ${site}`)
}

mediaLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    displayLegalAlert(link.textContent)
  })
})

//Random js stuff
const restructureDate = (date) => {
  let splitDate = date.split('-')

  let year = splitDate[0]
  let month = splitDate[1]
  let day = splitDate[2]

  return `${month}/${day}/${year}`
}

//Server Requests
const bookUs = (event) => {
  event.preventDefault()

  let name = document.querySelector('#booking-form-name').value
  let address = document.querySelector('#booking-form-address').value
  let date = document.querySelector('#booking-form-date').value
  let timesCheckboxes = document.querySelectorAll('.booking-blocks-selection:checked')

  let times = ""

  timesCheckboxes.forEach(checked => {
    times += ` ${checked.name}`
  })
  
  date = restructureDate(date)
  checkDate = new Date(date)

  if(name && address && date && times.length > 0){
    if(checkDate > new Date() && checkDate.getDay() !== 0){
      const body = {
        name,
        address,
        date,
        times
      }

      axios.post(`/api/booking`, body)
      .then(res => {
        alert(res.data)

        let year = checkDate.getFullYear()
        let month = checkDate.getMonth() + 1
    
        if(month < 10){
          month = '0' + month
        }
        
        let newDate = `${year}-${month}`

        viewedMonth.value = newDate

        clearBookingForm()
        getBookings()
      })
      .catch((err) => {
        alert('Date and time are already booked!\nPlease select another time.')
      })
    
    } else {
      alert("Please select a valid date." + "\n\n" + "Date's before today and same day booking is not accepted." + "\n\n" + "We do not operate on Sundays" + "\n\n" + "Please call if you would like to book us for today!")
    }
  } else {
    alert("Please fill out entire form")
  }
}

const getBookings = () => {
  let calendarDate

  if (viewedMonth.value){
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

  axios.get(`/api/booking/${calendarDate}`)
    .then(res => {
      const {bookedDates, pendingDates} = res.data

      // console.log(pendingDates)

      viewedMonth.value = res.data.date

      const firstOfMonth = new Date(restructureDate(`${res.data.date}-01`))
      const lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1, 0)

      createCalendar(lastOfMonth.getDate(), firstOfMonth.getDay(), pendingDates, bookedDates)
    })
    .catch(err => {
      console.log(err)
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
  
    axios.post(`/api/reviews`, body)
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
  axios.get(`/api/reviews`)
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