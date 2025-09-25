import { useState } from 'react';
import assets from '../../constants/icon';
import FormField from '../FormField';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import { dialogActions } from '../../store/slices/DialogSlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast, { Toaster } from 'react-hot-toast';
import { updateUserAvatar } from '../../store/slices/AuthSlice';

const appearances = ['Default', 'Dark', 'Light'];
const languages = ['English', 'Vietnamese', 'Japanese'];

function SettingDialog() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const [appearance, setAppearance] = useState('Default');
    const [language, setLanguage] = useState('English');
    const [name, setName] = useState(user.name || '');
    const [avatar, setAvatar] = useState(user.avatar || '');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);

        try {
            const uploadedUrl = await dispatch(updateUserAvatar(user.id, user.name, file)).unwrap();
            setAvatar(uploadedUrl);
            toast.success('Avatar updated!');
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
        }
    };

    return (
        <div className="w-full mx-auto mt-10 bg-white rounded-xl shadow p-6">
            {/* Account Section */}
            <Toaster />
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
                        <label className="relative cursor-pointer">
                            <img src={avatar} alt="avatar" className="w-14 h-14 mr-3 rounded-full object-cover" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            <span className="absolute bottom-0 right-2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                                <FontAwesomeIcon icon={assets.icon.edit} size="sm" />
                            </span>
                        </label>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger className="min-w-[100px]">
                                <Button
                                    variant="outline"
                                    className="border px-3 py-2 text-base hover:shadow-none rounded-md w-full"
                                >
                                    {appearance} <FontAwesomeIcon icon={assets.icon.dropdown} className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white min-w-[100px]">
                                <DropdownMenuGroup className="w-full border border-gray-300 rounded-md">
                                    {appearances.map((item) => (
                                        <DropdownMenuItem
                                            key={item}
                                            onClick={() => setAppearance(item)}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            <p>{item}</p>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Language</p>
                            <p className="text-base text-gray-500">Change the language used in the user interface.</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="min-w-[100px]">
                                <Button
                                    variant="outline"
                                    className="border px-3 py-2 text-base hover:shadow-none rounded-md w-full"
                                >
                                    {language} <FontAwesomeIcon icon={assets.icon.dropdown} className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white min-w-[100px] rounded-md">
                                <DropdownMenuGroup className="w-full border border-gray-300 rounded-md">
                                    {languages.map((item) => (
                                        <DropdownMenuItem
                                            key={item}
                                            onClick={() => setLanguage(item)}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            <p>{item}</p>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingDialog;
