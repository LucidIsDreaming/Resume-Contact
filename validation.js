export function validateForm(data) {
    console.log("Validating...");
    console.log(data);

    //store error messages in an array
    const errors = [];

    if(!data.fname || data.fname.trim() === "") {
        errors.push("First name is required");
    }

    if(!data.lname || data.lname.trim() === "") {
        errors.push("Last name is required");
    }


    //validate Size
    const validMeet = ['inperson', 'online', 'other-option'];
    if(!validMeet.includes(data.meet)) {
        errors.push("Select must be in-person, online, or other");
    }

    // Validate mailing list
    const validMethods = ['html', 'text'];

    if (data.mailList === 'mail-list') {
        if (!validMethods.includes(data.method)) {
            errors.push("Please select an email format");
        }
    }

    //return result
    console.log(errors);
    return {
        isValid: errors.length === 0,
        errors
    };
}