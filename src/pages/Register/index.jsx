import Button from '../../components/Button';
import FormField from '../../components/FormField';
import assets from '../../constants/icon';

function RegisterPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center py-12">
            <form
                action=""
                className="w-3/4 h-full bg-main rounded-2xl shadow-md px-32 flex flex-col items-baseline justify-center"
            >
                <h1 className="text-5xl font-bold text-center mb-2">Get Started Now</h1>
                <p className="text-2xl text-center mb-12">Let’s create your account</p>

                <div className="w-full">
                    <FormField
                        label="Full Name"
                        name="fullName"
                        type="text"
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your full name"
                        icon={assets.icon.user}
                        borderRadius="rounded-full"
                        className="mb-4 px-3 py-2"
                        widthFull={true}
                    />

                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your email"
                        icon={assets.icon.email}
                        borderRadius="rounded-full"
                        className="mb-4 px-3 py-2"
                        widthFull={true}
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
                        className="mb-4 px-3 py-2"
                        widthFull={true}
                    />
                    <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value=""
                        onChange={() => {}}
                        placeholder="Enter your password"
                        icon={assets.icon.lock}
                        borderRadius="rounded-full"
                        className="mb-4 px-3 py-2"
                        widthFull={true}
                    />
                </div>
                <div className="w-full flex justify-between items-center mb-6">
                    <label className="flex items-center text-lg">
                        <input type="checkbox" className="mr-2" />I agree to
                        <Button variant="text">the terms and conditions</Button>
                    </label>
                </div>

                <div className="w-full">
                    <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4  w-full ">
                        Sign Up
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
                        Sign Up with Google
                    </Button>
                </div>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-center text-lg mr-3">Already have an account?</p>
                    <Button variant="text" to="/login" className="text-headline">
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
