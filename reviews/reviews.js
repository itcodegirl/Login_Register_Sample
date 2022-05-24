const fetchReviews = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await response.json();
    return data.messages;
  } catch (err) {
    throw err;
  }
};
const getAccount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const userID = data.data._id;

    localStorage.setItem("userID", userID);
  } catch (err) {
    throw err;
  }
};
getAccount();
const renderReviews = async () => {
  const myReviewsHead = `<h1>Reviews</h1>`;
  const productReviewHead = `<h1>Product Reviews</h1>`;
  const reviews = await fetchReviews();
  $("#msg-board").empty();
  reviews.forEach((review) => {
    const reviewHTML = createReviewHTML(message);
    if (message.fromUser._id === localStorage.getItem("userID")) {
      $(".sent-reviews").prepend(reviewHTML);
    } else {
      $(".received-reviews").prepend(reviewHTML);
    }
  });
  $(".sent-reviews").prepend(myReviewHead);
  $(".received-reviews").prepend(sampleReviewHead);
};
renderReviews();
const createReviewHTML = (review) => {
  return $(`
    <div class="card" style="width: 30rem;">
    <div class="card-body">
    <h5 class="msg-card-title">From: ${review.fromUser.username}</h5>
    <h5 class="msg-card-subject">Subject: ${review.post.title}</h5>
    <p class="msg-card-text">${review.content}</p>
    </div>
    `).data("message", message);
};
const createReview = async (reviewObj) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "POST",
      body: JSON.stringify({
        review: reviewObj,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const newReview = await response.json();
    return newReview;
  } catch (err) {
    console.error(err);
  }
};

let currentProductReview;

$("#new-product-form").remove();
$("#review-btn").remove();

renderReviewButton();
