//HTML js code
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
  } else {
    alert('Please fill out all fields')
  }
}

reviewForm.addEventListener('submit', addReview)

const getReviews = () => {
  axios.get(`${baseURL}/reviews`)
  .then(res => {
    displayReviews(res.data)
  })
  .catch(err => {
    console.log(err)
  })
}

getReviews()