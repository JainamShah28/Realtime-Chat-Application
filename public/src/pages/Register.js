import Logo from '../assets/logo.svg';

import { Link, useNavigate } from 'react-router-dom';

import RegisterForm from '../components/RegisterFrom.js';

function Register() {
    const navigate = useNavigate();

    return (
        <div className="register-page box-border bg-[#131324] w-screen h-screen flex justify-center items-center text-white font-josefin-sans px-4">
            <div className="register-container w-full max-w-[580px] bg-[#00000076] flex flex-col justify-center items-center p-8 rounded-xl md:px-24 md:py-10 md:rounded-3xl xl:py-14">
                <div className="app-logo box-border flex items-center">
                    <img src={Logo} alt="Logo" className="w-12" />
                    <h1 className="font-bold uppercase text-lg ml-2 md:text-xl md:ml-3">snappy</h1>
                </div>

                <RegisterForm navigate={navigate} />

                <span className="uppercase font-bold text-sm mt-6 text-center">
                    already have an account ?
                    <Link to='/login' className="text-[#4e0eff] ml-2">login</Link>
                </span>
            </div>
        </div>
    )
}

export default Register;