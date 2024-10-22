const url = "https://jsonplaceholder.typicode.com/posts";
const loadingElemnt = document.querySelector("#loading");
const postsContainer = document.querySelector("#post-container");


const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comment-container");

const commentFrom = document.querySelector("#commnet-form");
const emaiInput = document.querySelector("#email");
const textareaComment = document.querySelector("#body");
//get id from url

const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get("id");

//get all posts

async function getAllPosts() {

    const response = await fetch(url)

    console.log(response)

    const data = await response.json();

    console.log(data)

    loadingElemnt.classList.add("hide");

    data.map((post) => {

        const div = document.createElement("div")
        const title = document.createElement("h2")
        const body = document.createElement("p")
        const link = document.createElement("a")

        title.innerText = post.title;
        body.innerHTML = post.body;
        link.innerHTML = "Ler";
        link.setAttribute("href", `./post.html?id=${post.id}`)

        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)

        postsContainer.appendChild(div)

    })
}

// get invidual post
async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ])

    const dataPost = await responsePost.json();
    console.log(dataPost)

    const dataComments = await responseComments.json();
    console.log(dataComments)

    loadingElemnt.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = dataPost.title;
    body.innerHTML = dataPost.body;

    postContainer.appendChild(title)
    postContainer.appendChild(body)

    dataComments.map((comment) => {
        createComment(comment)

    })
}

function createComment(comment) {

    const div = document.createElement("div")
    const email = document.createElement("h3")
    const commentBody = document.createElement("p")

    email.innerText = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email)
    div.appendChild(commentBody)
    commentsContainer.appendChild(div)
}

//post a comment

async function postComment(comment) {
    
    const response = await fetch(`${url}/${postId}/comments`,{
        method: "POST",
        body: comment,
        headers:{
            "content-type":"application/json",
        },
    });

    const data = await response.json();
    createComment(data)

}

if (!postId) {
    getAllPosts();
} else {
    getPost(postId)

    // add event to comment form

    commentFrom.addEventListener("submit",(e) =>{
       e.preventDefault();
       let comment ={
        email: emaiInput.value,
        body: textareaComment.value,
       };
      
       comment = JSON.stringify(comment);
       postComment(comment);
    });
}