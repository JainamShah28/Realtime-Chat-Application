import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Loader from '../assets/loader.gif';

function SetAvatar() {
    const [avatars, setAvatars] = React.useState([]),
        [isLoading, setIsLoading] = React.useState(true),
        [selectedAvatar, setSelectedAvatar] = React.useState(),
        [errorMessage, setErrorMessage] = React.useState(''),
        navigate = useNavigate(),
        { userID } = useParams();

    React.useEffect(() => {
        const generateAvtars = async () => {
            try {
                const avatarsArr = [];

                for (let i = 0; i < 4; i++) {
                    const avatar = await fetch(`https://api.multiavatar.com/${Math.ceil(Math.random() * 1000)}.png?apikey=r6cZUpaV8JYo50`);

                    if (avatar.ok) {
                        avatarsArr.push(avatar.url);
                    }
                }

                setAvatars(avatarsArr);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        generateAvtars();
    }, []);

    React.useEffect(() => {
        if (avatars.length !== 0) {
            setSelectedAvatar(avatars[0]);
        }
    }, [avatars]);

    function handleClick(event) {
        setSelectedAvatar(event.target.src);
    }

    async function setAvatarAsProfile() {
        console.log(`http://localhost:5000/users/setprofilepic/${userID}`);
        try {
            const response = await fetch(`http://localhost:5000/users/setprofilepic/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "avatar": selectedAvatar
                }),
                credentials: "include"
            });

            console.log(response);

            if (response.ok) {
                navigate('/');
            } else {
                setErrorMessage("Something went wrong, please try again");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="set-avatar-page box-border bg-[#131324] w-screen h-screen flex justify-center items-center text-white font-josefin-sans px-4">
            {
                isLoading ?
                    <img src={Loader} alt="Loader" /> :
                    (
                        <div className="set-avatar-container box-border flex flex-col justify-center items-center w-full max-w-[640px] bg-[#00000076] rounded-xl p-8 md:px-24 md:py-10 md:rounded-3xl xl:py-14">
                            <h1 className="text-xl text-center font-bold xl:text-2xl">Pick an avatar as your profile picture</h1>

                            <div className="avatars-container flex justify-center items-center mt-6 md:mt-8 xl:mt-10">
                                {
                                    avatars.map((avatar, index) => {
                                        return (
                                            <img
                                                key={index}
                                                className={`avatar w-12 rounded-full cursor-pointer transition-all duration-150 ease-linear xl:w-16 ${index !== 3 ? "mr-6 xl:mr-10" : ""} ${avatar === selectedAvatar ? "outline outline-4 outline-[#4e0eff] outline-offset-4" : ""}`}
                                                src={avatar}
                                                alt="Avatar"
                                                onClick={handleClick}
                                            />
                                        )
                                    })
                                }
                            </div>

                            <div className={`${errorMessage !== '' ? "mt-8 text-red-600 font-normal text-xs md:mt-10 xl:mt-12" : ""}`}>{errorMessage}</div>

                            <button className="btn-primary uppercase mt-8 px-4 md:mt-10 xl:mt-12" onClick={setAvatarAsProfile}>set as profile picture</button>
                        </div>
                    )
            }
        </div>
    )
}

export default SetAvatar;