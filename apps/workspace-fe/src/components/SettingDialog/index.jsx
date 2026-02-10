import { useState } from 'react';
import assets from '../../constants/icon';
import FormField from '../FormField';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import { changeUserInfo, updateUserAvatar } from '../../store/slices/AuthSlice';
import { Loader2Icon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

/**
 * This component displays the user settings dialog,
 * allowing the user to customize appearance, language,
 * and update personal information such as name and avatar.
 */

const appearances = ['Default', 'Dark', 'Light']; // UI theme options
const languages = ['English', 'Vietnamese']; // Language options

function SettingDialog({ triggerBtn }) {
    const dispatch = useDispatch();

    // Retrieve the current logged-in user from Redux store
    const user = useSelector((state) => state.auth.user);

    // Local state variables to store user settings and input
    const [appearance, setAppearance] = useState('Default');
    const [language, setLanguage] = useState('English');
    const [name, setName] = useState(user.name || '');
    const [avatar, setAvatar] = useState(user.avatar || '');

    const isLoading = useSelector((state) => state.auth.loading);

    /**
     * Triggered when the user selects a new avatar image.
     * Previews the selected image locally and uploads it
     * to update the user's avatar in the database.
     */
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Display preview before uploading
        const previewUrl = URL.createObjectURL(file);
        setAvatar(previewUrl);

        try {
            // Dispatch Redux action to upload new avatar
            const updatedUser = await dispatch(updateUserAvatar({ userId: user.id, file })).unwrap();

            setAvatar(updatedUser.avatar);
            toast.success('Avatar updated!');
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
        }
    };

    const handleUpdateUserName = async () => {
        if (name && name !== user.name) {
            let userId = user.id;
            let newName = name;
            await dispatch(changeUserInfo({ userId, newName })).unwrap();
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="w-full">{triggerBtn}</DialogTrigger>
            <DialogContent className="w-1/2">
                <DialogHeader>
                    <DialogTitle>
                        <h2 className="text-2xl font-semibold mb-2">Account</h2>
                    </DialogTitle>
                    <DialogDescription>
                        <hr className="mb-4 border-t border-gray-400" />
                    </DialogDescription>
                </DialogHeader>
                <div className="mb-6 w-full">
                    <div className="mb-4">
                        {/* Name & Email */}
                        <div className="flex items-center mb-4 justify-center">
                            {!isLoading ? (
                                <label className="relative cursor-pointer">
                                    <Avatar className="w-21 h-21 mr-3 rounded-full object-cover border border-gray-300">
                                        <AvatarImage src={avatar} />
                                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <span className="absolute bottom-0 right-2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                                        <FontAwesomeIcon icon={assets.icon.edit} size="sm" />
                                    </span>
                                </label>
                            ) : (
                                <div className="w-21 h-21 mr-3 rounded-full object-cover border border-gray-300 flex items-center justify-center">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                            )}
                            <div className="flex-1">
                                <FormField
                                    label="Full Name"
                                    name="fullName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={handleUpdateUserName}
                                    icon={assets.icon.user}
                                    borderRadius="rounded-xl"
                                    borderColor="border-stroke"
                                    className="px-3 py-1"
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
                                <p className="text-base text-gray-500">
                                    Change the language used in the user interface.
                                </p>
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
            </DialogContent>
        </Dialog>
    );
}

export default SettingDialog;
// <div className="w-full mx-auto mt-10 bg-white rounded-xl shadow p-6">
//     {/* Account Section */}
//     <Toaster />

// </div>
