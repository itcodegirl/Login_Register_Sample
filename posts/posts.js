let allPosts = [];
let authorPosts = [];
let othersPosts = [];
let currentPost;

// LOAD USERS DATA

const fetchMyData = async () => {
  if (localStorage.getItem("loggedIn")) {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
};

// BUILD AND RENDER POSTS

const fetchAllPosts = async () => {
  try {
    const url = `${BASE_URL}/posts`;
    const response = await fetch(
      url,
      token
        ? {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    );

    const { data } = await response.json();
    allPosts = data.posts;
    allPosts.forEach((element) => {
      if (element.isAuthor === true) {
        authorPosts.push(element);
      } else {
        othersPosts.push(element);
      }
    });
    return allPosts;
  } catch (err) {
    throw err;
  }
};

const buildPostHTML = (post) => {
  const element = $(`
                <div class="card flexed" style="width: 50rem;">
                    <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <span class="card-text" style="margin-right: 5px;"><b>Seller:</b> ${
                      post.author.username
                    }</span>
                    <span class="card-text" style="margin-right: 5px;"><b>Price:</b> ${
                      post.price
                    }</span>
                    <span class="card-text" style="margin-right: 5px;"><b>Delivery:</b> ${
                      post.willDeliver ? "available" : "unavailable"
                    }</span>
                    
                    ${
                      post.isAuthor
                        ? `<div class="user-buttons"></div>`
                        : `<div class="other-user-buttons"></div>`
                    }
                    </div>
                </div>
                `).data("post", post);
  return element;
};

const renderAllPosts = async () => {
  $("#my-posts").empty();
  $("#posts").empty();
  const data = await fetchAllPosts();
  authorPosts.forEach((post) => {
    const postHTML = buildPostHTML(post);
    const deleteButton = `<span><button type="submit" id="delete" class="btn btn-sm btn-primary" style="margin-top: 1rem; margin-right: 1rem;">DELETE</button><span></span>`;
    const editButton = `<span><button type="submit" id="edit" class="btn btn-sm btn-primary" style="margin-top: 1rem; margin-right: 1rem;">EDIT</button><span>`;
    $("#my-posts").prepend(postHTML);
    $(".user-buttons").html(deleteButton + editButton);
  });
  othersPosts.forEach((post) => {
    const postHTML = buildPostHTML(post);
    const messageButton = `<span><button type="submit" id="message" class="btn btn-sm btn-primary" style="margin-top: 1rem; margin-right: 1rem;">MESSAGE</button><span>`;
    $("#posts").prepend(postHTML);
    $(".other-user-buttons").html(messageButton);
  });
};
// BUILD AND RENDER "ADD POST"
const addPostHTML = () => {
  const form = `
    <div id="new-post-form">
    <form class="new-post">
        <div class="form-group">
        <label for="new-post-title">New Post Title</label>
        <input type="text" class="form-control" id="new-post-title" placeholder="New Post Title">
        </div>
        <div class="form-group">
        <label for="new-post-description">Item Description</label>
        <input type="text" class="form-control" id="new-post-description" placeholder="Item Description">
        </div>
        <div class="form-group">
        <label for="new-post-location">Item Location</label>
        <input type="text" class="form-control" id="new-post-location" placeholder="Item Location">
    </div>
        <div class="form-group">
            <label for="new-post-price">Item Price</label>
            <input type="text" class="form-control" id="new-post-price" placeholder="Item Price">
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" checked="" id="deliver">
          <label class="form-check-label" for="deliver">
            Will Deliver?
          </label>
        </div>
        <button type="submit" id="new-post-submit" class="btn btn-sm btn-primary" style="margin-top: 1rem;">POST!</button>
  </form>
  </div>`;

  $("#app").append(form);
};

const postNewPost = async () => {
  const title = $("#new-post-title").val();
  const description = $("#new-post-description").val();
  const price = $("#new-post-price").val();
  let willDeliver = false;
  if ($("#deliver").prop("checked")) {
    willDeliver = true;
  } else {
    willDeliver = false;
  }
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        post: {
          title: `${title}`,
          description: `${description}`,
          price: `${price}`,
          willDeliver: `${willDeliver}`,
        },
      }),
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    localStorage.setItem("userID", data.data.post.author._id);
    return data;
  } catch (err) {
    throw err;
  }
};

// DELETE POST

const deletePost = async (postID) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //Token string goes in after bearer in the string
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// EDIT POSTS

const editPostHTML = () => {
  const form = `
    <div id="edit-post-form" style="margin: 5px;">
    <form class="edit-post">
        <div class="form-group">
        <label for="edit-post-title">Edit Post Title</label>
        <input required type="text" class="form-control" id="edit-post-title" placeholder="Edit Post Title">
        </div>
        <div class="form-group">
        <label for="edit-post-description">Edit Item Description</label>
        <input required type="text" class="form-control" id="edit-post-description" placeholder="Edit Item Description">
        </div>
        <div class="form-group">
        <label for="edit-post-location">Edit Item Location</label>
        <input required type="text" class="form-control" id="edit-post-location" placeholder="Edit Item Location">
    </div>
        <div class="form-group">
            <label for="edit-post-price">Edit Item Price</label>
            <input required type="text" class="form-control" id="edit-post-price" placeholder="Edit Item Price">
        </div>
        <div class="form-check">
          <input  class="form-check-input" type="checkbox" value="" id="deliver">
          <label class="form-check-label" for="deliver">
            Will Deliver?
          </label>
        </div>
        <button type="submit" id="edit-post-submit" class="btn btn-sm btn-primary" style="margin-top: 1rem;">POST!</button>
  </form>
  </div>`;

  return form;
};

const patchFetch = async (postID) => {
  const title = $("#edit-post-title").val();
  const description = $("#edit-post-description").val();
  const price = $("#edit-post-price").val();
  const location = $("#edit-post-location").val();
  let willDeliver = false;
  if ($("#deliver").prop("checked")) {
    willDeliver = true;
  } else {
    willDeliver = false;
  }
  try {
    await fetch(`${BASE_URL}/posts/${postID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        post: {
          title: title,
          description: description,
          price: price,
          location: location,
          willDeliver: willDeliver,
        },
      }),
    });
  } catch (err) {
    throw err;
  }
};

// SEND MESSAGE

const messageForm = `
                      <div id="message-form">
                        <textarea class="message-to-seller form-control" rows="3" style="margin: 1rem; display: inline; max-width: 550px;"></textarea>
                        <button type="submit" id="send-message" class="btn btn-sm btn-primary" style="margin: 0 0 1rem 1rem;">SEND!</button>
                      </div>
                    `;

async function sendMessage(postID) {
  const message = $(".message-to-seller").val();
  try {
    const response = await fetch(`${BASE_URL}/posts/${postID}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: {
          content: message,
        },
      }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

// LISTENERS

$("#my-posts").on("click", "#delete", async function () {
  const postElement = $(this).closest(".card");
  const post = postElement.data("post");
  try {
    const result = await deletePost(post._id);
    postElement.slideUp();
    renderAllPosts();
  } catch (err) {
    throw err;
  }
});

$("#posts").on("click", "#message", async function () {
  $("#message-form").remove();
  const postElement = $(this).closest(".card");
  postElement.append(messageForm);
});

$("#posts").on("click", "#send-message", async function () {
  const postElement = $(this).closest(".card");
  const post = postElement.data("post");
  let currentPost = post;
  try {
    const result = await sendMessage(currentPost._id);
    $("#message-form").remove();
    postElement.append(
      `<p style="margin: 10px; font-weight: bold; color: blue;>MESSAGE SENT!!!</p>`
    );
  } catch (err) {
    throw err;
  }
});

const editPostButtonListener = () => {
  $(".edit-post").on("submit", async function (element) {
    element.preventDefault();
    const postElement = $(this).closest(".card");
    const post = postElement.data("post");
    let currentPost = post;
    try {
      const result = await patchFetch(currentPost._id);
      $("#edit-post-form").remove();
      location.reload();
      return result;
    } catch (err) {
      throw err;
    }
  });
};

$("#my-posts").on("click", "#edit", async function () {
  $("#edit-post-form").remove();
  const postElement = $(this).closest(".card");
  postElement.append(editPostHTML);
  editPostButtonListener();
});

const addPostButtonListener = () => {
  $(".new-post").on("submit", async (event) => {
    event.preventDefault();
    await postNewPost();
    location.reload();
  });
};

// RENDER HOME PAGE
fetchMyData();
renderAllPosts();
addPostHTML();
addPostButtonListener();
