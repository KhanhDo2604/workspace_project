import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';
import { resetPasswordUser } from '../../store/slices/AuthSlice';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';

function SetPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.auth.loading);

    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            setErrorPassword('Password is required');
        } else if (!confirmPassword) {
            setErrorConfirmPassword('Confirm Password is required');
        }

        if (password !== confirmPassword) {
            setErrorConfirmPassword('Passwords do not match');
        }

        try {
            const token = searchParams.get('token');
            const userId = searchParams.get('id');

            if (!token || !userId) {
                toast.error('Invalid password reset link');
                return;
            }

            await dispatch(resetPasswordUser({ userId: userId, token: token, password: password }));
            toast.success('Password has been reset successfully');

            setTimeout(() => {
                navigate(`/login`, { replace: true });
            }, 1000);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <Toaster />
            <form
                action=""
                className="w-3/4 h-full bg-main rounded-2xl shadow-md px-32 flex flex-col items-baseline justify-center"
            >
                <h1 className="text-5xl font-bold text-center mb-2">Set New Password</h1>
                <p className="text-2xl text-center mb-12">Create a new password for your account</p>

                <div className="w-full">
                    <FormField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        error={errorPassword}
                        widthFull={true}
                    />

                    <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4 px-3"
                        error={errorConfirmPassword}
                        widthFull={true}
                    />
                </div>

                <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4 w-full" onClick={handleSubmit}>
                    {isLoading ? (
                        <div className="flex items-center">
                            <Loader2Icon className="animate-spin" />
                            <span className="ml-2">Sending...</span>
                        </div>
                    ) : (
                        'Set Password'
                    )}
                </Button>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg">Remember old password?</p>
                    <Button variant="link">
                        <Link to={'/login'}>Sign In</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SetPasswordPage;
