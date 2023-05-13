import Robot from '../assets/robot.gif';

function Welcome({ userName }) {
    return (
        <div className="welcome-screen w-full h-full flex flex-col justify-center items-center">
            <img src={Robot} alt="Robot" className="w-80" />
            <h1 className="font-bold text-2xl">Welcome, <span className="capitalize text-[#4e0eff]">{userName} !</span></h1>
            <p className="text-sm font-bold">Please select a chat to Start Messaging</p>
        </div>
    );
}

export default Welcome;