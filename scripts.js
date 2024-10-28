document.addEventListener("DOMContentLoaded", function () {
    const postForm = document.getElementById("post-form");

    if (postForm) {
        postForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Form se data lo
            const title = document.getElementById("title").value;
            const content = document.getElementById("content").value;
            const image = document.getElementById("image").files[0];

            const reader = new FileReader();
            reader.onloadend = function () {
                const base64Image = reader.result;

                // Data ko save karo
                createPost(title, content, base64Image);
            };

            if (image) {
                reader.readAsDataURL(image);
            } else {
                createPost(title, content, null);
            }
        });
    }

    function createPost(title, content, image) {
        // New post object create karo
        const post = { title, content, image, createdAt: new Date() };

        // LocalStorage me post save karo
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.push(post);
        localStorage.setItem("posts", JSON.stringify(posts));

        window.location.href = "index.html"; // Back to main page
    }

    // Agar posts list karna hai
    const postsContainer = document.getElementById("posts-container");
    if (postsContainer) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];

        posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            if (post.image) {
                const img = document.createElement("img");
                img.src = post.image;
                postDiv.appendChild(img);
            }

            const postInfo = document.createElement("div");
            const postTitle = document.createElement("h2");
            postTitle.className = "post-title";
            postTitle.textContent = post.title;

            const postContent = document.createElement("p");
            postContent.className = "post-content";
            postContent.textContent = post.content;

            postInfo.appendChild(postTitle);
            postInfo.appendChild(postContent);
            postDiv.appendChild(postInfo);

            postsContainer.appendChild(postDiv);
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Edit post form handle karna
    const editForm = document.getElementById("edit-post-form");
    if (editForm) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const postToEdit = posts.find(post => post.id === parseInt(postId));

        if (postToEdit) {
            // Populate the form with existing post data
            document.getElementById("post-id").value = postToEdit.id;
            document.getElementById("title").value = postToEdit.title;
            document.getElementById("content").value = postToEdit.content;
        }

        editForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const updatedTitle = document.getElementById("title").value;
            const updatedContent = document.getElementById("content").value;
            const imageFile = document.getElementById("image").files[0];

            const reader = new FileReader();
            reader.onloadend = function () {
                const base64Image = reader.result;

                // Update the post
                updatePost(postId, updatedTitle, updatedContent, base64Image);
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
            } else {
                updatePost(postId, updatedTitle, updatedContent, null);
            }
        });
    }

    function updatePost(id, title, content, image) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        const postIndex = posts.findIndex(post => post.id === parseInt(id));

        if (postIndex !== -1) {
            posts[postIndex].title = title;
            posts[postIndex].content = content;

            if (image) {
                posts[postIndex].image = image;  // Only update image if a new one is provided
            }

            localStorage.setItem("posts", JSON.stringify(posts));
            window.location.href = "index.html";  // Redirect to main page after edit
        }
    }
});

// Agar posts list karna hai
const postsContainer = document.getElementById("posts-container");
if (postsContainer) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";

        if (post.image) {
            const img = document.createElement("img");
            img.src = post.image;
            postDiv.appendChild(img);
        }

        const postInfo = document.createElement("div");
        const postTitle = document.createElement("h2");
        postTitle.className = "post-title";
        postTitle.textContent = post.title;

        const postContent = document.createElement("p");
        postContent.className = "post-content";
        postContent.textContent = post.content;

        const editButton = document.createElement("a");
        editButton.href = `edit_post.html?id=${post.id}`;
        editButton.textContent = "Edit Post";
        editButton.className = "edit-button";

        postInfo.appendChild(postTitle);
        postInfo.appendChild(postContent);
        postInfo.appendChild(editButton);
        postDiv.appendChild(postInfo);

        postsContainer.appendChild(postDiv);
    });
}




function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`/delete_post/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Redirect if needed
            } else {
                location.reload(); // Reload to see changes if no redirection
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
