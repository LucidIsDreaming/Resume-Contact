document.getElementById("contact-form").onsubmit = () => {

    let isValid = true;

    clearErrors();
    
    //text box validaton

    let fname = document.getElementById("fname").value.trim();
        if (fname === "") {
            document.getElementById("err-fname").style.display = "block";
            isValid = false;
        }

    let lname = document.getElementById("lname").value.trim();
        if (lname === "") {
            document.getElementById("err-lname").style.display = "block";
            isValid = false;
        }

    let linked = document.getElementById("linked").value.trim();
        if (linked !== "" && !linked.startsWith("https://linkedin.com/in/")) {
            document.getElementById("err-linked").style.display = "block";
            isValid = false;
        }

    let email = document.getElementById("email").value.trim();
    //add new let to check if the mailing list is selected
    let mailList = document.getElementById("mail-list").checked; //.checked to see if box is checked
        if (mailList && email === "") {
            document.getElementById("err-email").textContent = "Email is required for mailing list";
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        } else if (email !== "" && (!email.includes("@") || !email.includes("."))){
            document.getElementById("err-email").textContent = "Enter a valid email address";
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        }

    let meet = document.getElementById("meet").value;


         if(meet === "none") {
             document.getElementById("err-meet").style.display = "block";
             isValid = false;
         }
    

    return isValid;
}


function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}
