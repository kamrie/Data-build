
// Regex patterns
const emailRegX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// let emailRegX = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
let passwordRegX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
let phoneRegX =   /^(\+\d{1,3})?\d{10,15}$/;

//console.log(emailRegx.test("ifedikeze@gmail.com")); // true
console.log(passwordRegX.test("yecretAassw8or890@gmail.")); // true


let errorParagraph= document.getElementById("error")
console.log(errorParagraph)
const username = document.getElementById('username'); 
const fname = document.getElementById('fname'); 
const email = document.getElementById('email'); 
const phone = document.getElementById('phone'); 
const referralUsername= document.getElementById('ref-username');
const password = document.getElementById('password'); 
const rePassword = document.getElementById('re-password');
// const address = document.getElementById('address')
const termsCheckbox = document.getElementById('termsCheckbox');
const signUpButton = document.getElementById('signUpButton');



termsCheckbox.addEventListener('change', () => {
    if (termsCheckbox.checked){
        signUpButton.disabled = false; // Enable the button
    }else{
        signUpButton.disabled = true; // Disable the button
    }
})


//function to show error message
function showError(message) {
    const errorParagraph= document.getElementById("error")
    errorParagraph.textContent = message; // Set the error message
     errorParagraph.style.display = 'block'; // Show the error

    setTimeout(() => { 
        errorParagraph.textContent = ""; 
        errorParagraph.style.display = 'none'; // Show the error

    } , 5000);
  }
  
//Form submission event listener
document.getElementById('signUpForm').addEventListener('submit', async function (e) {
  e.preventDefault();  // Prevent default form submission

  if(username.value === ""||fname.value === "" || email.value === "" || phone.value ==="" || password.value === "" || rePassword.value === ""){
    // errorParagraph.textContent = "Please validate all fields😊"
      showError("Please validate all fields😊")
        
    }else if(password.value !== rePassword.value){
        // errorParagraph.textContent = "password fields do not match"
        showError("password fields do not match")          
    } else if(!emailRegX.test(email.value)){
        console.log("Invalid email:", email.value); // Debugging output
        // errorParagraph.textContent = " Enter a valid email address."
         showError("Enter a valid email address.")       
    }else if(!passwordRegX.test(password.value)){
        console.log("password should have atleast one UPPERCASE,one LOWERCASE AND 8 characters:", password.value); // Debugging output
        // errorParagraph.textContent = "password should have atleast one UPPERCASE,one LOWERCASE AND 8 characters"
       showError("password should have atleast one UPPERCASE,one LOWERCASE AND 8 characters")
      
    }else if (!phoneRegX.test(phone.value)) {
        console.log("Invalid phone number:", phone.value); // Debugging output
        // errorParagraph.textContent = "Invalid phone number";
        showError("Invalid phone number")
      
    }else {
            const signUpData = {
                username: username.value,
                fname:  fname.value,
                email:  email.value,
                phone: phone.value,
                referralUsername: referralUsername.value,
                password : password.value,
                // rePassword: rePassword.value,
                // address: address.value,
                termsCheckbox:termsCheckbox.checked,
                // signUpButton: signUpButton.value
            } 
                console.log("signUpData", signUpData)
                console.log("Form submitted successfully")
      

                 // Submit form data to the server
            try {
                const response = await fetch('http://localhost:3500/api/auth/signup', {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signUpData)
                })
                console.log('Full response object: ', response)

                console.log("Response status:", response.status);

                   
                if (response.ok){
                    const data = await response.json();
                    console.log("Data responser", data);
                    alert("Registration successful! Welcome aboard.");
                    document.getElementById('signUpForm').reset(); // Reset the form
                    window.location.href = '/client/signin.html'; // Redirect to the login page

                }else{
                    const error = await response.json();
                    console.error("Server error details:", error.message); //this error.message value is specified in the backend 
                    showError(error.message || "Something went wrong. Please try again.")

                }
              

            } catch (err) {
                console.log("Chai Network error", err);
            }

      }

    if (!termsCheckbox.checked) {
        alert('You must agree to the terms and conditions to proceed.');
        return;
    }

    // console.log("Form submission handled by JavaScript");
       
        
})






