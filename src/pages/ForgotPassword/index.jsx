import { useState } from 'react';
import FormField from '../../components/FormField';
import { Button } from '../../components/ui/button';
import assets from '../../constants/icon';
import { requestPasswordResetUser } from '../../store/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';

/**
 * This component provides a simple password recovery interface.
 * It includes email validation, error handling, and integration with the backend password reset endpoint through Redux actions.
 */
function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /** Loading state from Redux store to indicate ongoing request */
    const isLoading = useSelector((state) => state.auth.loading);

    /** Form state: email input and error message */
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    /**
     * Handles form submission and triggers password reset request.
     * Validates the email input before dispatching an action.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorEmail('Email is required');
            return;
        } else if (!email.includes('@')) {
            setErrorEmail('Invalid email address');
            return;
        }
        try {
            await dispatch(requestPasswordResetUser(email)).unwrap();
            toast.success('Password reset link has been sent to your email');

            navigate('/login', { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <Toaster />

            {/* Reset password form */}
            <form
                action=""
                className="w-3/4 h-full bg-main rounded-2xl shadow-md px-32 flex flex-col items-baseline justify-center"
            >
                {/* Lock icon */}
                <div className="bg-headline rounded-full p-5 flex items-center justify-center mb-8">
                    <img src={assets.icon.lock} alt="lock" className="w-12 h-12" />
                </div>

                {/* Header text */}
                <h1 className="text-5xl font-bold text-center mb-2">Forgot Password?</h1>
                <p className="text-2xl text-center mb-12">Enter your email to reset your password</p>

                {/* Email input field */}
                <div className="w-full mb-8">
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
                </div>

                {/* Submit button */}
                <Button
                    variant="primary"
                    className="mr-4 mb-2 rounded-full px-2 py-4 text-headline w-full"
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <Loader2Icon className="animate-spin" />
                            <span className="ml-2">Sending...</span>
                        </div>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
