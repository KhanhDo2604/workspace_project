import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Dropdown from '../../components/Dropdown';
import assets from '../../constants/icon';

function HomePage() {
    return (
        <div className="p-6">
            <Button variant="primary" className="mr-4 mb-2 rounded-full px-2 py-4  w-1/4">
                Click Me
            </Button>
            <Button
                variant="secondary"
                startIcon={<img src={assets.icon.google} alt="Secondary Icon" />}
                className="mr-4 mb-2 rounded-full px-2 py-4  w-1/4"
            >
                Secondary Button
            </Button>

            <Button
                variant="primary"
                endIcon={<img src={assets.icon.dropdown} alt="Right Chevron Icon" />}
                className="mr-4 mb-2 rounded-xl"
            >
                Click Me
            </Button>

            <Button variant="text">text button</Button>

            <br />

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

            <FormField
                label="Password"
                name="password"
                type="password"
                value=""
                onChange={() => {}}
                placeholder="Enter your password"
                icon={assets.icon.lock}
                borderRadius="rounded-full"
            />

            <FormField
                type="text"
                value=""
                onChange={() => {}}
                placeholder="Message #social-media"
                borderColor="border-black/20"
            />

            <FormField
                label="Message textarea"
                type="textarea"
                value=""
                onChange={() => {}}
                placeholder="something"
                borderColor="border-black/20"
            />

            <Dropdown
                label="Select an option"
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    { label: 'Option 3', value: 'option3' },
                ]}
                onSelect={(option) => console.log(option)}
                placeholder="Choose an option"
            />

            <Dropdown
                label="Select an option"
                options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    { label: 'Option 3', value: 'option3' },
                ]}
                onSelect={(option) => console.log(option)}
                placeholder="Choose an option"
                variant="primary"
            />
        </div>
    );
}

export default HomePage;
