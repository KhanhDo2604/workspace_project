import Button from '../../components/Button';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';

function SetPasswordPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
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
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your new password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                    />

                    <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value=""
                        onChange={() => {}}
                        placeholder="Confirm your new password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                    />
                </div>

                <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4  w-full">
                    Save New Password
                </Button>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg mr-3">Remember old password?</p>
                    <Button variant="text">Sign In</Button>
                </div>
            </form>
        </div>
    );
}

export default SetPasswordPage;
