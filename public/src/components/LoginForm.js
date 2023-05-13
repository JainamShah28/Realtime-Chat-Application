import React from 'react';

function LoginForm({ navigate }) {
    const [userDetails, setUserDetails] = React.useState({
        userName: '',
        password: ''
    }),
        [errorMessages, setErrorMessages] = React.useState({
            userName: '',
            password: ''
        }),
        [clickCount, setClickCount] = React.useState(1);

    React.useEffect(() => {
        const login = async () => {
            try {
                const { userName, password } = userDetails;

                if (userName !== '' && password !== '') {
                    const response = await fetch('http://localhost:5000/users/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userName": userName,
                            "password": password
                        }),
                        credentials: 'include'
                    });

                    if (response.status === 200) {
                        navigate('/');
                    } else {    
                        setErrorMessages({
                            userName: "Incorrect username or password",
                            password: "Incorrect username or password"
                        });
                    }
                } 
            } catch (error) {
                console.log(error);
            }
        }

        login();
    }, [clickCount]);

    function isValidForm() {
        const { userName, password } = userDetails;

        if (userName === '') {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    userName: "Username should not be empty"
                };
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    userName: ""
                };
            });
        }

        if (password === '') {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    password: "Password should not be empty"
                };
            });
        } else {
            setErrorMessages(prevErrorMessages => {
                return {
                    ...prevErrorMessages,
                    password: ""
                };
            });
        }
    }

    function loginUser() {
        isValidForm();
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

            <input type="password" name="password" placeholder="Password" onChange={(event) => handleChange(event)} className="primary-input" autoComplete="off" value={userDetails.password} />
            <div className="error-text">{errorMessages.password}</div>

            <button className="btn-primary w-full mt-6 uppercase" onClick={loginUser}>Login</button>
        </div>
    );
}

export default LoginForm;