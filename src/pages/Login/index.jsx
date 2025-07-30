import Button from '../../components/Button';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';

function LoginPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
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
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your email"
                        icon={assets.icon.email}
                        borderRadius="rounded-full"
                        className="mb-4"
                    />

                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4"
                    />
                </div>
                <div className="w-full flex justify-between items-center mb-6">
                    <label className="flex items-center text-lg">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                    </label>
                    <Button variant="text" to="/forgot-password">
                        Forgot Password
                    </Button>
                </div>

                <div className="w-full">
                    <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4 w-full">
                        Sign in
                    </Button>

                    <div className="flex items-center justify-center w-full my-4">
                        <hr className="flex-grow border-t border-blue-200" />
                        <span className="mx-3 ">or</span>
                        <hr className="flex-grow border-t border-blue-200" />
                    </div>
                    <Button
                        variant="secondary"
                        startIcon={<img src={assets.icon.google} alt="Secondary Icon" />}
                        className="mr-4 mb-2 rounded-full px-2 py-4  w-full"
                    >
                        Sign in with Google
                    </Button>
                </div>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg mr-3">Don't have an account?</p>
                    <Button variant="text" to="/signup">
                        Sign Up
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
