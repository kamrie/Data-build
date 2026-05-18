
// const loginLink = document.getElementById("login-link")

// loginLink.addEventListener("click", function(event) {
//     event.preventDefault(); // Prevent default navigation
//     console.log("clickkedd")

//     setTimeout(function() {
//         window.location.href = "/client/signIn.html"; //  login page URL
//     }, 100000); // Delay of 1 second
// });

console.log("JS loaded");

const username = document.getElementById('username'); 
const password = document.getElementById('password'); 

function showError(message) {
    const errorParagraph= document.getElementById("error")
    errorParagraph.textContent = message; // Set the error message
     errorParagraph.style.display = "block"; // Show the error

    setTimeout(() => { 
        errorParagraph.textContent = ""; 
         errorParagraph.style.display = 'none'; // Show the error
}, 5000);

  }


  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 
    console.log("submitted")

    const loginData = {
      username:  username.value ,
      password:  password.value
    }
    console.log("loginData: ", loginData);

    try {
        const response = await fetch('http://localhost:3500/api/auth/signin', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', //Without this: cookie will NOT be saved
            body: JSON.stringify(loginData)
        })
        console.log('Full response object: ', response)
        console.log("Response status:", response.status);
       
        if (response.ok){
            const data = await response.json();
            console.log("Data responser", data);

        // 🔐 TEST PROTECTED ROUTE
            const protectedRes = await fetch('http://localhost:3500/api/user/test', {
                method: 'GET',
                credentials: 'include'  // VERY IMPORTANT
            });
            
            const protectedData = await protectedRes.json();
            console.log("Protected route:", protectedData);

            

            alert("Login successful!.");
            document.getElementById('loginForm').reset(); // Reset the form
            window.location.href = '/client/KamdraBundle.html'; // Redirect to the login page
        }else{
            const error = await response.json();
            console.error("Server error details:", error.message); //this error.message value is specified in the backend 
            showError(error.message || "Something went wrong. Please try again.")
        }
} catch (err) {
        console.log("Signin not working: ", err)
    }
});  