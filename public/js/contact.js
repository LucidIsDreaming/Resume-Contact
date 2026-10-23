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

    // let title = document.getElementById("title").value.trim();
    //     if (title === "") {
    //         document.getElementById("err-title").style.display = "block";
    //         isValid = false;
    //     }

    // let company = document.getElementById("company").value.trim();
    //     if (company === "") {
    //         document.getElementById("err-company").style.display = "block";
    //         isValid = false;
    //     }

    let linked = document.getElementById("linked").value.trim();
        if (linked === "") {
            document.getElementById("err-linked").style.display = "block";
            isValid = false;
        }

    let email = document.getElementById("email").value.trim();
        if (email === "") {
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        }

    // let other = document.getElementById("other").value.trim();
    //select method validation
    let meet = document.getElementById("meet").value;

        // if (meet === "other-option" && other === "") {
        //     document.getElementById("err-other").style.display = "block";
        //     isValid = false;
        // }  

         if(meet === "none") {
             document.getElementById("err-meet").style.display = "block";
             isValid = false;
         }
    
  

    //message validation

    // let comment = document.getElementById("comment").value.trim();
    //     if(comment === "") {
    //         document.getElementById("err-comment").style.display = "block";
    //         isValid = false;
    //     }

    // let methodSelected = false;
    // let methodButtons = document.getElementsByName("method");

    // for (let i=0; i<methodButtons.length; i++) {
    //     if(methodButtons[i].checked) {
    //         methodSelected = true;
    //     }
    // }

    // if(methodSelected === false) {
    //     document.getElementById("err-method").style.display = "block";
    //     isValid = false;
    // }


    return isValid;
}


function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}
