import React from 'react';

function RegisterForm({ navigate }) {
    const [userDetails, setUserDetails] = React.useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    }),
        [errorMessages, setErrorMessages] = React.useState({
            userName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }),
        [clickCount, setClickCount] = React.useState(1);
    
    function isValidForm() {
        const { userName, email, password, confirmPassword } = userDetails;
        let isValidate = true;

        if (userName.length <= 2) {
            isValidate = false;
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    userName: 'The length of username should be greter then 2'
                };
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    userName: ''
                };
            });
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            isValidate = false;
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    email: 'Please enter valid email'
                }
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    email: ''
                };
            });
        }

        if (password.length <= 4) {
            isValidate = false;
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    password: 'The length of password should be greater then 4'
                };
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    password: ''
                };
            });
        }

        if (password !== confirmPassword) {
            isValidate = false;
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    confirmPassword: 'Password must be same'
                }
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    confirmPassword: ''
                };
            });
        }

        return isValidate;
    }

    React.useEffect(() => {
        try {
            if (clickCount !== 1 && isValidForm()) {
                const register = async () => {
                    const response = await fetch('http://localhost:5000/users/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userName": userDetails.userName,
                            "email": userDetails.email,
                            "password": userDetails.password
                        })
                    }),
                        data = await response.json();

                    if (data.success) {
                        navigate(`/setavatar/${data.id}`);
                    } else {
                        if (data.message === "Username has been already taken") {
                            setErrorMessages(prevErrorMessages => {
                                return {
                                    ...prevErrorMessages,
                                    userName: data.message
                                };
                            });
                        } else {
                            setErrorMessages(prevErrorMessages => {
                                return {
                                    ...prevErrorMessages,
                                    email: data.message
                                };
                            });
                        }
                    }
                }

                register();
            }
        } catch (error) {
            throw error;
        }
    }, [clickCount]);

    function registerUser() {
        setClickCount(prevClickCount => prevClickCount + 1);
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setUserDetails((prevUserDetails) => {
            return (
                {
                    ...prevUserDetails,
                    [name]: value
                }
            );
        });
    }

    return (
        <div className="register-form box-border flex flex-col justify-center items-center w-full mt-2">
            <input type="text" name="userName" placeholder="Username" onChange={(event) => handleChange(event)} className="primary-input" autoComplete="off" autoFocus={true} value={userDetails.userName} />
            <div className="error-text">{errorMessages.userName}</div>

            <input type="email" name="email" placeholder="Email" onChange={(event) => handleChange(event)} className="primary-input" autoComplete="off" value={userDetails.email} />
            <div className="error-text">{errorMessages.email}</div>

            <input type="password" name="password" placeholder="Password" onChange={(event) => handleChange(event)} className="primary-input" autoComplete="off" value={userDetails.password} />
            <div className="error-text">{errorMessages.password}</div>

            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={(event) => handleChange(event)} className="primary-input" autoComplete="off" value={userDetails.confirmPassword} />
            <div className="error-text">{errorMessages.confirmPassword}</div>

            <button className="btn-primary w-full mt-6 uppercase" onClick={registerUser}>Create User</button>
        </div>
    );
}

export default RegisterForm;