import Button from '../../components/Button';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';

function ForgotPasswordPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <form
                action=""
                className="w-3/4 h-full bg-main rounded-2xl shadow-md px-32 flex flex-col items-baseline justify-center"
            >
                <div className="bg-headline rounded-full p-5 flex items-center justify-center mb-8">
                    <img src={assets.icon.lock} alt="lock" className="w-12 h-12" />
                </div>
                <h1 className="text-5xl font-bold text-center mb-2">Forgot Password?</h1>
                <p className="text-2xl text-center mb-12">Enter your email to reset your password</p>

                <div className="w-full mb-8">
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your email"
                        icon={assets.icon.email}
                        borderRadius="rounded-full"
                    />
                </div>

                <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4  w-full">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
