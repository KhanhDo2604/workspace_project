import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assets from '../../constants/icon';
import { createMeeting, deleteMeeting, updateMeeting } from '../../store/slices/MeetingSlice';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ConfirmDialog from '../ConfirmDialog';
import { CalendarButton } from '../CalendarButton';
import toast, { Toaster } from 'react-hot-toast';

function MeetingModal({ meeting, triggerBtn }) {
    const dispatch = useDispatch();
    const currentProject = useSelector((state) => state.project.currentProject);
    const isLoading = useSelector((state) => state.meeting.loading);
    const projects = useSelector((state) => state.project.projects);
    const userId = localStorage.getItem('user_id');

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(meeting ? meeting.title : '');
    const [startTime, setStartTime] = useState(meeting ? meeting.startTime : 0);
    const [endTime, setEndTime] = useState(meeting ? meeting.endTime : 0);
    const [participants, setParticipants] = useState(meeting ? meeting.participants : currentProject.participants);

    const listParticipants = meeting
        ? projects.find((p) => p.id === meeting.projectId)?.participants
        : currentProject.participants;

    const resetForm = () => {
        setTitle(meeting ? meeting.title : '');
        setStartTime(meeting ? meeting.startTime : 0);
        setEndTime(meeting ? meeting.endTime : 0);
        setParticipants(meeting ? meeting.participants : currentProject.participants);
    };

    const handleCreateMeeting = async (meetingInfo) => {
        await dispatch(createMeeting({ ...meetingInfo })).unwrap();
        setOpen(false);
        resetForm();
    };

    const handleUpdateMeeting = async () => {
        if (title.trim() === '' || !startTime || !endTime || participants.length === 0) {
            alert('Please fill in all required fields.');
            return;
        }

        await dispatch(
            updateMeeting({
                id: meeting.id,
                title: title,
                startTime: startTime,
                endTime: endTime,
                participants: participants.map((p) => p._id),
                projectId: meeting.projectId,
            }),
        ).unwrap();
        toast.success('Meeting updated successfully');

        setOpen(false);
        resetForm();
    };

    const handleDeleteMeeting = async () => {
        await dispatch(deleteMeeting(meeting.id)).unwrap();
        toast.success('Meeting deleted successfully');
        setOpen(false);
        resetForm();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) resetForm();
            }}
        >
            <Toaster position="top-right" reverseOrder={false} />
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>{meeting ? 'Edit Meeting' : 'Create Meeting'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Title</h1>
                        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Start Date</h1>
                        <CalendarButton
                            value={startTime}
                            onChange={(date) => {
                                const timestamp = Math.floor(date / 1000);
                                setStartTime(timestamp);
                            }}
                        />
                    </div>

                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">End Date</h1>
                        <CalendarButton
                            value={endTime}
                            onChange={(date) => {
                                const timestamp = Math.floor(date / 1000);
                                setEndTime(timestamp);
                            }}
                        />
                    </div>

                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Assignees</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full border border-gray-300 rounded-md">
                                <Button
                                    variant="outline"
                                    className="w-full border-none flex flex-wrap gap-2 justify-start shadow-none"
                                >
                                    {participants.length > 0
                                        ? participants.map((m) => (
                                              <span
                                                  key={m._id}
                                                  className="px-3 py-1 bg-gray-200 text-base text-gray-800 rounded-full flex items-center"
                                              >
                                                  {m.name}

                                                  <button
                                                      className="ml-1 text-red-500 hover:text-red-700 p-0 m-0"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setParticipants((prev) =>
                                                              prev.filter((x) => x._id !== m._id),
                                                          );
                                                      }}
                                                  >
                                                      <FontAwesomeIcon icon={assets.icon.close} size="sm" />
                                                  </button>
                                              </span>
                                          ))
                                        : 'Select Assignees'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup className="bg-white w-full max-h-60 overflow-y-auto border border-x-gray-300 rounded-b-md border-b-gray-300">
                                    {listParticipants.map((member) => (
                                        <DropdownMenuItem
                                            key={member._id}
                                            className="cursor-pointer text-base flex justify-between"
                                            onClick={() =>
                                                setParticipants((prev) =>
                                                    prev.find((m) => m._id === member._id)
                                                        ? prev.filter((m) => m._id !== member._id)
                                                        : [...prev, member],
                                                )
                                            }
                                        >
                                            {member.name}
                                            {listParticipants.find((m) => m._id === member._id) && (
                                                <span className="text-green-500 font-bold">✓</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    {meeting && (
                        <ConfirmDialog
                            message={`Are you sure you want to delete this meeting?`}
                            onCancel={() => {}}
                            onConfirm={async () => await handleDeleteMeeting()}
                            triggerBtn={
                                <Button className="bg-tertiary hover:bg-red-700" disabled={isLoading}>
                                    {isLoading ? <Loader2Icon className="animate-spin" /> : 'Delete Meeting'}
                                </Button>
                            }
                        />
                    )}
                    <div className="ml-auto flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            onClick={() => {
                                if (endTime <= startTime) {
                                    alert('Start date cannot be after End date');
                                    return;
                                }

                                let meetingInfo;
                                if (meeting) {
                                    meetingInfo = {
                                        ...meeting,
                                        title: title,
                                        startTime: startTime,
                                        endTime: endTime,
                                        participants: participants.map((p) => p._id),
                                    };
                                } else {
                                    meetingInfo = {
                                        projectId: currentProject.id,
                                        title: title,
                                        startTime: startTime,
                                        endTime: endTime,
                                        participants: participants.map((p) => p._id),
                                        userId: userId,
                                    };
                                }
                                meeting ? handleUpdateMeeting(meetingInfo) : handleCreateMeeting(meetingInfo);
                            }}
                        >
                            {isLoading ? <Loader2Icon className="animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MeetingModal;
