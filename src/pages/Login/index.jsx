import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';
import { loginUser } from '../../store/slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getAllProjects } from '../../store/slices/ProjectSlice';

function LoginPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const navigate = useNavigate();

    const isLoading = useSelector((state) => state.auth.loading);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorEmail('email are required');
            return;
        } else if (!password) {
            setErrorPassword('password are required');
            return;
        } else if (!email.includes('@')) {
            setErrorEmail('Invalid email address format');
            return;
        }
        try {
            const res = await dispatch(loginUser({ email, password })).unwrap();
            console.log(res);

            const userId = localStorage.getItem('user_id');
            await dispatch(getAllProjects(res.data.userId || userId)).unwrap();

            toast.success(res.message);

            navigate(`/my-space/${res.data.userId || userId}`, { replace: true });
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
                <h1 className="text-5xl font-bold text-center mb-2">Welcome Back</h1>
                <p className="text-2xl text-center mb-12">Sign in to your account</p>

                <div className="w-full">
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        icon={assets.icon.email}
                        borderRadius="rounded-full"
                        className="mb-4 px-3 py-2"
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
                        className="mb-4 px-3 py-2"
                        widthFull={true}
                        error={errorPassword}
                    />
                </div>
                <div className="w-full flex justify-between items-center mb-6">
                    <label className="flex items-center text-lg">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                    </label>

                    <Button variant="link">
                        <Link to={'/forgot-password'}>Forgot Password</Link>
                    </Button>
                </div>

                <div className="w-full">
                    <Button
                        variant="primary"
                        className="mr-4 mb-2 rounded-full px-2 py-4 text-headline w-full"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader2Icon className="animate-spin" />
                                <span className="ml-2">Signing in...</span>
                            </div>
                        ) : (
                            'Sign In'
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
                        <img src={assets.icon.google} alt="Google Icon" /> Sign in with Google
                    </Button>
                </div>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg">Don't have an account?</p>

                    <Button variant="link">
                        <Link to={'/signup'}>Sign Up</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
