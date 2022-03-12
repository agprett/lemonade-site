//HTML js code
const bookingSubmit = document.querySelector('.booking-submit')
const bookingCancel = document.querySelector('.booking-cancel')
const overallRating = document.getElementById('overall-rating')
const reviewForm = document.querySelector(".review-form")
const reviewSection = document.querySelector('.review-section')

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

  overallRating.textContent = `Our Overall Rating: ${summedReviews}/5`

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

      axios.post(`${baseURL}/booking`, body)
    
    } else {
      alert("Please select a valid date." + "\n\n" + "Date's before today and same day booking is not accepted." + "\n\n" + "We do not operate on Sundays" + "\n\n" + "Please call if you would like to book us for today!")
    }
  } else {
    alert("Please fill out entire form")
  }
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

reviewForm.addEventListener('submit', addReview)

getReviews()