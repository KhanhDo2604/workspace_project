import { useDispatch, useSelector } from 'react-redux';

import FormField from '../../components/FormField';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import assets from '../../constants/icon';
import toast, { Toaster } from 'react-hot-toast';
import { signupUser } from '../../store/slices/AuthSlice';
import { Loader2Icon } from 'lucide-react';

function RegisterPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorPassword, setErrorPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorFullName, setErrorFullName] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    const navigate = useNavigate();

    const isLoading = useSelector((state) => state.auth.loading);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorEmail('email are required');
            return;
        } else if (!password) {
            setErrorPassword('password are required');
            return;
        } else if (!confirmPassword) {
            setErrorConfirmPassword('confirm password are required');
            return;
        } else if (!fullName) {
            setErrorFullName('full name are required');
            return;
        }

        if (password !== confirmPassword) {
            setErrorPassword('Passwords do not match');
            return;
        }
        if (!email.includes('@')) {
            setErrorEmail('Invalid email address format');
            return;
        }

        try {
            const res = await dispatch(signupUser({ email: email, password: password, userName: fullName })).unwrap();
            toast.success(res.message);

            setTimeout(() => {
                navigate(`/login`, { replace: true });
            }, 2000);
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <Toaster />

            <form
                action=""
                className="w-3/4 h-full bg-main rounded-2xl shadow-md px-32 flex flex-col items-baseline justify-center"
            >
                <h1 className="text-5xl font-bold text-center mb-2">Get Started Now</h1>
                <p className="text-2xl text-center mb-8">Let’s create your account</p>

                <div className="w-full">
                    <FormField
                        label="Full Name"
                        name="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        icon={assets.icon.user}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        widthFull={true}
                        error={errorFullName}
                    />

                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        icon={assets.icon.email}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        widthFull={true}
                        error={errorEmail}
                    />

                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        widthFull={true}
                        error={errorPassword}
                    />
                    <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter your password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        widthFull={true}
                        error={errorConfirmPassword}
                    />
                </div>
                {/* <div className="w-full flex justify-between items-center mb-5">
                    <label className="flex items-center text-lg">
                        <input type="checkbox" className="mr-2" />I agree to
                        <Button variant="link">the terms and conditions</Button>
                    </label>
                </div> */}

                <div className="w-full">
                    <Button
                        variant="primary"
                        className="mr-4 rounded-full px-2 py-4 text-headline w-full"
                        onClick={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader2Icon className="animate-spin" />
                                <span className="ml-2">Signing up...</span>
                            </div>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>

                    <div className="flex items-center justify-center w-full my-4">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-3 text-xl">or</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <Button
                        variant="outline"
                        className="mr-4 mb-2 rounded-full px-2 py-4 w-full shadow-none text-button"
                    >
                        <img src={assets.icon.google} alt="Google Icon" /> Sign Up with Google
                    </Button>
                </div>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg">Already have an account?</p>

                    <Button variant="link">
                        <Link to={'/login'}>Sign In</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
