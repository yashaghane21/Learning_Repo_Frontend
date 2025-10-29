import { Link, useNavigate } from 'react-router-dom';
import img1 from '../Images/Signup.png';
import { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cpass, setConfPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();
    const server = import.meta.env.VITE_SERVER;

    // Send OTP to email
    const sendOtp = async () => {
        if (!email.endsWith("@tcetmumbai.in")) {
            toast.warn("Only TCET Mumbai students can register!", { autoClose: 2000 });
            return;
        }

        try {
            const { data } = await axios.post(`${server}/api/v3/send-otp`, { email });
            console.log(data);
            if (data.success) {
                toast.success(data.message, { autoClose: 2000 });
                setOtpSent(true);
            } else {
                toast.warn(data.message, { autoClose: 2000 });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        }
    };

    // Handle Signup with OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            toast.error("Please send OTP first", { autoClose: 2000 });
            return;
        }

        if (password !== cpass) {
            toast.error("Passwords do not match", { autoClose: 2000 });
            return;
        }

        try {
            const { data } = await axios.post(`${server}/api/v3/register`, {
                name,
                email,
                username,
                password,
                cpassword: cpass,
                otp
            });

            if (data.success) {
                toast.success("Registration Successful!", { autoClose: 2000 });
                navigate("/login");
            } else {
                toast.warn(data.message, { autoClose: 2000 });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="w-100 pt-16 bg-gray-200 justify-center px-5 lg:px-72 md:pb-52 max-md:pb-16">
            <div className="w-[100%] flex md:flex-row max-md:flex-col-reverse p-3 bg-white shadow-xl rounded-md">
                <div className="w-[60%] max-md:w-[100%] max-md:pb-8 h-auto text-center text-2xl font-semibold p-2">
                    <h1 className='font underline underline-offset-2 max-md:mt-5'>Sign Up</h1>
                    <div className='mt-5'>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                required
                            />
                            <input
                                type="email"
                                className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            <button
                                type="button"
                                onClick={sendOtp}
                                className="w-[80%] mt-2 p-2 text-lg bg-yellow-400 hover:bg-yellow-300 rounded-lg"
                            >
                                Send OTP
                            </button>

                            {otpSent && (
                                <input
                                    type="text"
                                    className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    required
                                />
                            )}

                            <input
                                type="text"
                                className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                maxLength={10}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                            <input
                                type="password"
                                className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <input
                                type="password"
                                className="w-[80%] border-b-2 border-yellow-200 text-black focus:outline-none focus:border-yellow-400 focus:bg-white text-lg p-1 placeholder:text-slate-500 mt-3"
                                value={cpass}
                                onChange={(e) => setConfPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                            <button
                                type="submit"
                                className='w-[80%] mt-8 p-2 text-lg bg-yellow-400 hover:bg-yellow-300 rounded-lg'
                            >
                                Sign Up
                            </button>
                        </form>

                        <p className='text-sm font-normal mt-6 max-md:mt-8'>
                            Already have an account? <Link className='text-blue-600' to='/Login'>Login here</Link>
                        </p>
                    </div>
                </div>
                <div className="w-[40%] max-md:w-[100%] h-auto">
                    <img src={img1} className='h-[100%] w-100 max-md:w-[100%] max-md:h-52 rounded-md' />
                </div>
            </div>
        </div>
    );
}
