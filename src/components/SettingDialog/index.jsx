import { useState } from 'react';
import assets from '../../constants/icon';
import FormField from '../FormField';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import { dialogActions } from '../../store/slices/DialogSlice';

function SettingDialog() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const [appearance, setAppearance] = useState('Default');
    const [language, setLanguage] = useState('English');
    const [name, setName] = useState(user.name || '');

    return (
        <div className="w-full mx-auto mt-10 bg-white rounded-xl shadow p-6">
            {/* Account Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold mb-2">Account</h2>
                    <Button variant="text" onClick={() => dispatch(dialogActions.closeSetting())}>
                        X
                    </Button>
                </div>
                <hr className="mb-4 border-t border-gray-400" />

                <div className="mb-4">
                    {/* Name & Email */}
                    <div className="flex items-center ml-4">
                        <img src={assets.image.userTemp} alt="" className="w-14 h-14 mr-3" />
                        <div className="flex-1">
                            <FormField
                                label="Full Name"
                                name="fullName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={assets.icon.user}
                                borderRadius="rounded-xl"
                                borderColor="border-stroke"
                                className="mb-4 px-3 py-1"
                                widthFull={true}
                            />
                        </div>
                    </div>
                    <FormField
                        label="Email"
                        type="email"
                        value="khanhdph2604@gmail.com"
                        icon={assets.icon.email}
                        borderRadius="rounded-xl"
                        borderColor="border-stroke"
                        className="mb-4 px-3 py-1"
                        widthFull={true}
                        disable={true}
                    />
                </div>
            </div>

            {/* Setting Section */}
            <div>
                <h2 className="text-2xl font-semibold mb-2">Setting</h2>
                <hr className="mb-4 border-t border-gray-400" />

                <div className="space-y-4">
                    {/* Appearance */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Appearance</p>
                            <p className="text-base text-gray-500">Customize your workspace theme.</p>
                        </div>
                        <select
                            className="border rounded px-3 py-2 text-base"
                            value={appearance}
                            onChange={(e) => setAppearance(e.target.value)}
                        >
                            <option value="Default">Default</option>
                            <option value="Dark">Dark</option>
                            <option value="Light">Light</option>
                        </select>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Language</p>
                            <p className="text-base text-gray-500">Change the language used in the user interface.</p>
                        </div>
                        <select
                            className="border rounded px-3 py-2 text-base"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Japanese">Japanese</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingDialog;
