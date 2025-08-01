// import { useDispatch } from 'react-redux';
// import { dialogActions } from '../../store/slices/DialogSlice';
// import assets from '../../constants/icon';
import { useState } from 'react';
import Dropdown from '../../components/Dropdown';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { dialogActions } from '../../store/slices/DialogSlice';

function AddScheduleDialog() {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(null);

    const participants = [
        { label: 'John Doe', value: 'john_doe' },
        { label: 'Jane Smith', value: 'jane_smith' },
        { label: 'Alice Johnson', value: 'alice_johnson' },
    ];

    return (
        <div className="w-1/2 h-fit mt-10 bg-white rounded-xl shadow-sm mx-auto absolute top-0 left-0 right-0 z-50">
            <div className="p-4 flex justify-center items-center">
                <h1 className="text-2xl font-bold">Add Schedule</h1>
            </div>

            <div className="p-4 border border-gray-300 text-xl space-y-6">
                <div className="grid grid-cols-5 items-center gap-4">
                    <p className="col-span-1">Conference Topic *</p>
                    <FormField
                        name="conferenceTopic"
                        type="text"
                        placeholder="Set a conference topic before it starts"
                        onChange={() => {}}
                        borderRadius="rounded-xl"
                        borderColor="border-stroke"
                        className="col-span-4"
                    />
                </div>

                <div className="grid grid-cols-5 items-center gap-4">
                    <p className="col-span-1">Host name *</p>
                    <Dropdown
                        options={participants}
                        onSelect={(option) => setSelected(option)}
                        selected={selected}
                        placeholder="Select Host"
                        variant="secondary"
                        className="col-span-4 w-full"
                    />
                </div>

                <div className="grid grid-cols-5 items-start gap-4">
                    <p className="col-span-1">Description</p>
                    <FormField
                        name="description"
                        type="textarea"
                        placeholder="Add a description for the conference"
                        onChange={() => {}}
                        borderRadius="rounded-xl"
                        borderColor="border-stroke"
                        className="col-span-4"
                    />
                </div>
            </div>

            <div className="p-4 text-xl space-y-6">
                <div className="grid grid-cols-5 items-center gap-4">
                    <p className="col-span-1">Date and time *</p>
                    <div className="col-span-4 flex items-center gap-2">
                        <FormField
                            type="date"
                            placeholder="dd/mm/yy"
                            onChange={() => {}}
                            borderRadius="rounded-xl"
                            borderColor="border-stroke"
                            className="col-span-4 w-full"
                        />
                        <Dropdown
                            options={[
                                { label: 'AM', value: 'am' },
                                { label: 'PM', value: 'pm' },
                            ]}
                            onSelect={() => {}}
                            selected={selected}
                            placeholder="AM"
                            variant="secondary"
                            className="col-span-4 w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-5 items-center gap-4">
                    <p className="col-span-1">Set duration</p>
                    <div className="col-span-4 flex items-center gap-2">
                        <FormField
                            type="text"
                            placeholder="..."
                            onChange={() => {}}
                            borderRadius="rounded-xl"
                            borderColor="border-stroke"
                            className="flex-1"
                        />
                        <p className="text-base">/hour</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 justify-center items-center mb-4">
                <Button
                    variant="secondary"
                    onClick={() => dispatch(dialogActions.closeAddScheduleDialog())}
                    className="text-xl rounded-lg border border-stroke text-stroke px-4"
                >
                    Cancel
                </Button>

                <Button className="text-xl rounded-lg border border-button px-6">Save</Button>
            </div>
        </div>
    );
}

export default AddScheduleDialog;
