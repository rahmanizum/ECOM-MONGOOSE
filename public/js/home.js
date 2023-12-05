import helperFunctions from "/js/helperFunctions.mjs";

//ON ADMIN SIGNUP
const adminSignupElements = {
    name: adminsignup_form.querySelector('input[name="Name"]'),
    email: adminsignup_form.querySelector('input[name="Email"]'),
    phoneNo: adminsignup_form.querySelector('input[name="PhoneNumber"]'),
    password1: adminsignup_form.querySelector('input[name="Password1"]'),
    password2: adminsignup_form.querySelector('input[name="Password2"]'),
    signup_btn: adminsignup_form.querySelector('input[type="submit"]'),
    alert1: adminsignup_form.querySelector('#alert1'),
    alert2: adminsignup_form.querySelector('#alert2'),
    alert3: adminsignup_form.querySelector('#alert3'),
}
adminSignupElements.signup_btn.addEventListener('click', on_adminSignup);
async function on_adminSignup(e) {
    try {
        if (adminsignup_form.checkValidity()) {
            e.preventDefault();
            if (adminSignupElements.password1.value === adminSignupElements.password2.value) {
                const data = {
                    name: adminSignupElements.name.value,
                    email: adminSignupElements.email.value,
                    phonenumber: adminSignupElements.phoneNo.value,
                    password: adminSignupElements.password1.value
                }
                await axios.post("admin/signup", data);
                adminsignup_form.reset();
                helperFunctions.alertFunction(adminSignupElements.alert3);
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 3000)
            } else {
                helperFunctions.alertFunction(adminSignupElements.alert2);
            }
        }

    } catch (error) {
        if (error.response && error.response.status === 409) {
            e.preventDefault();
            console.log("Authentication failed. User is already exist.");
            helperFunctions.alertFunction(adminSignupElements.alert1);
        } else {
            alert("Something went wrong - signup agin")
            console.error("An error occurred:", error);
        }
    }
}

//ON ADMIN SIGN IN 
const adminSigninElements = {
    email: adminsignin_form.querySelector('input[name="Email"]'),
    password: adminsignin_form.querySelector('input[name="Password"]'),
    signin_btn: adminsignin_form.querySelector('input[type="submit"]'),
    alert1: adminsignin_form.querySelector('#alert1'),
    alert2: adminsignin_form.querySelector('#alert2'),
    alert3: adminsignin_form.querySelector('#alert3'),

}
adminSigninElements.signin_btn.addEventListener('click', onAdminSignin);
async function onAdminSignin(e) {
    try {
        if (adminsignin_form.checkValidity()) {
            e.preventDefault();
            const data = {
                email: adminSigninElements.email.value,
                password: adminSigninElements.password.value
            }
            const signinResponse = await axios.post("admin/signin", data);
            adminsignin_form.reset();
            helperFunctions.alertFunction(adminSigninElements.alert3);
            setTimeout(() => {
                window.location.href = "/admin";
            }, 3000)
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            helperFunctions.alertFunction(adminSigninElements.alert2)
        } else if (error.response && error.response.status === 409) {
            helperFunctions.alertFunction(adminSigninElements.alert1)
        } else {
            alert("Something went wrong - Sign in again");
            console.log(error);
        }

    }
}

//ON CUSTOMER SIGNUP
const customerSignupElements = {
    name: customersignup_form.querySelector('input[name="Name"]'),
    email: customersignup_form.querySelector('input[name="Email"]'),
    phoneNumber: customersignup_form.querySelector('input[name="PhoneNumber"]'),
    password1: customersignup_form.querySelector('input[name="Password1"]'),
    password2: customersignup_form.querySelector('input[name="Password2"]'),
    signup_btn: customersignup_form.querySelector('input[type="submit"]'),
    alert1: customersignup_form.querySelector('#alert1'),
    alert2: customersignup_form.querySelector('#alert2'),
    alert3: customersignup_form.querySelector('#alert3')
}
customerSignupElements.signup_btn.addEventListener('click', onCustomerSignUp);
async function onCustomerSignUp(e) {
    try {
        if (customersignup_form.checkValidity()) {
            e.preventDefault();
            if (customerSignupElements.password1.value === customerSignupElements.password2.value) {
                const data = {
                    name: customerSignupElements.name.value,
                    email: customerSignupElements.email.value,
                    phonenumber: customerSignupElements.phoneNumber.value,
                    password: customerSignupElements.password1.value,
                };
                await axios.post("customer/signup", data);
                customersignup_form.reset();
                helperFunctions.alertFunction(customerSignupElements.alert3);
                setTimeout(() => {
                    window.location.href = "/customer";
                }, 3000)
            } else {
                helperFunctions.alertFunction(customerSignupElements.alert2);
            }

        }

    } catch (error) {
        if (error.response && error.response.status === 409) {
            helperFunctions.alertFunction(customerSignupElements.alert1);
        } else {
            alert("Something went wrong - Sign up again");
        }

    }
}

//ON CUSTOMER SIGNIN
const customerSigninElements = {
    email: customersignin_form.querySelector('input[name="Email"]'),
    password: customersignin_form.querySelector('input[name="Password"]'),
    signin_btn: customersignin_form.querySelector('input[type="submit"]'),
    alert1: customersignin_form.querySelector('#alert1'),
    alert2: customersignin_form.querySelector('#alert2'),
    alert3: customersignin_form.querySelector('#alert3')
}
customerSigninElements.signin_btn.addEventListener('click', onCustomerSignIn);
async function onCustomerSignIn(e) {
    try {
        if (customersignin_form.checkValidity()) {
            e.preventDefault();
            const data = {
                email: customerSigninElements.email.value,
                password: customerSigninElements.password.value,
            };
            await axios.post("/customer/signin", data);
            customersignin_form.reset();
            helperFunctions.alertFunction(customerSigninElements.alert3);
            setTimeout(() => {
                window.location.href = "/customer";
            }, 3000)
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            helperFunctions.alertFunction(customerSigninElements.alert2)
        } else if (error.response && error.response.status === 409) {
            helperFunctions.alertFunction(customerSigninElements.alert1)
        } else {
            alert("Something went wrong - Sign in again");
            console.log(error);
        }
    }
}

//ON ADMIN FORGOTPASSWORD 

const adminForgotModalELements = {
    email: adminforgot_form.querySelector('input[name="Email"]'),
    submit_btn: adminforgot_form.querySelector('input[type="submit"]'),
    alert1: adminforgot_form.querySelector('#alert1'),
    alert2: adminforgot_form.querySelector('#alert2'),
}
adminForgotModalELements.submit_btn.addEventListener('click', adminForgotpassword);
async function adminForgotpassword(e) {
    try {
        if (e.target && e.target.classList.contains("submit") && adminforgot_form.checkValidity()) {
            e.preventDefault();
            const data = {
                email: adminForgotModalELements.email.value
            }
            await axios.post('password/admin/forgotpassword', data);
            helperFunctions.alertFunction(adminForgotModalELements.alert2);
            setTimeout(()=>{
                $('#adminforgotdModal').modal('hide');
                adminforgot_form.reset();
            },1500)
        }


    } catch (error) {
        if (error.response && error.response.status === 404) {
            helperFunctions.alertFunction(adminForgotModalELements.alert1);

        } else {
            console.log("Error occured while sending mail.", error);
            alert(error.response.data.message);
        }
    }
}

//ON CUSTOMER FORGOT PASSWORD

const customerForgotModalELements = {
    email: customerforgot_form.querySelector('input[name="Email"]'),
    submit_btn: customerforgot_form.querySelector('input[type="submit"]'),
    alert1: customerforgot_form.querySelector('#alert1'),
    alert2: customerforgot_form.querySelector('#alert2'),
}
customerForgotModalELements.submit_btn.addEventListener('click', customerForgotPassword);
async function customerForgotPassword(e) {
    try {
        if (e.target && e.target.classList.contains("submit") && customerforgot_form.checkValidity()
        ) {
            e.preventDefault();
            const data = {
                email: customerForgotModalELements.email.value
            }
            await axios.post('password/customer/forgotpassword', data);
            helperFunctions.alertFunction(customerForgotModalELements.alert2);
            setTimeout(()=>{
                $('#customerforgotdModal').modal('hide');
                customerforgot_form.reset();
            },1500)
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            helperFunctions.alertFunction(customerForgotModalELements.alert1);
        } else {
            console.log("Error occured while sending mail.", error);
            alert(error.response.data.message);
        }
    }
}

