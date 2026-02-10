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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assets from '../../constants/icon';
import toast, { Toaster } from 'react-hot-toast';
import {
    addMemberToProject,
    deleteProject,
    removeMemberFromProject,
    updateProject,
} from '../../store/slices/ProjectSlice';
import ConfirmDialog from '../ConfirmDialog';
import { Loader2Icon } from 'lucide-react';

function ProjectDetailModal({ triggerBtn, project, isHost }) {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.project.loading);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const [participants, setParticipants] = useState(project.participants || []);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [openAddMember, setOpenAddMember] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);

    const userId = localStorage.getItem('user_id');

    const handleUpdateProject = async () => {
        const participantsIds = participants.map((member) => member._id);

        await dispatch(
            updateProject({
                projectId: project.id,
                title: title,
                projectName: description,
                participants: participantsIds,
            }),
        ).unwrap();

        toast.success('Project updated successfully');
    };

    const handleDeleteProject = async () => {
        await dispatch(deleteProject(project.id)).unwrap();
        toast.success('Project deleted successfully');
    };

    const handleAddMemberInProject = async () => {
        if (!newMemberEmail) {
            toast.error('Please enter an email address');
            return;
        }

        if (participants.some((member) => member.email === newMemberEmail) || newMemberEmail === currentUser.email) {
            toast.error('User is already a member of the project');
            return;
        } else if (!/\S+@\S+\.\S+/.test(newMemberEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        const result = await dispatch(addMemberToProject({ projectId: project.id, email: newMemberEmail })).unwrap();
        setParticipants((prev) => [...prev, result.user]);
    };

    const handleRemoveMemberInProject = async (memberId) => {
        await dispatch(removeMemberFromProject({ projectId: project.id, memberId: memberId })).unwrap();
    };

    const isChanged = title !== project.title || description !== project.description;

    const addMemberWidget = () => {
        return (
            <div className="flex flex-col mt-2">
                <Button
                    type="button"
                    variant="text"
                    className=" text-stroke self-start hover:shadow-white py-3"
                    onClick={() => setOpenAddMember(!openAddMember)}
                >
                    <FontAwesomeIcon icon={assets.icon.add} size="sm" />
                    <p className="font-bold text-lg leading-0">Add Member</p>
                </Button>

                {openAddMember && (
                    <div>
                        <Input
                            placeholder="Enter email to add member"
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                        />

                        <Button
                            type="button"
                            className="bg-button mt-1"
                            onClick={handleAddMemberInProject}
                            disabled={isLoading || !newMemberEmail}
                        >
                            {isLoading ? <Loader2Icon className="animate-spin" /> : 'Save Member'}
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog>
            <Toaster />
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                    <DialogTitle>Project Detail</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Project Name</h1>
                        <Input
                            id="name-1"
                            name="name"
                            defaultValue={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Description</h1>
                        <Input
                            id="description-1"
                            name="description"
                            defaultValue={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Host</h1>
                        <p className="text-sm text-gray-500">{project.host.name}</p>
                    </div>
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Member list</h1>
                        <div className="max-h-40 overflow-y-auto border p-2 rounded">
                            {participants.map((member) => {
                                return (
                                    <div key={member._id} className="flex items-center justify-between py-1">
                                        <span className="text-sm">{member.name}</span>
                                        {isHost && member._id !== userId && participants.length > 1 && (
                                            <ConfirmDialog
                                                message={`Are you sure you want to remove ${member.name} from this project?`}
                                                onCancel={() => {}}
                                                onConfirm={async () => {
                                                    setParticipants(participants.filter((m) => m._id !== member._id));
                                                    await handleRemoveMemberInProject(member._id);
                                                    toast.success(`${member.name} has been removed from the project.`);
                                                }}
                                                triggerBtn={
                                                    <Button variant="text" className="p-0 hover:bg-transparent">
                                                        <FontAwesomeIcon
                                                            icon={assets.icon.close}
                                                            className="text-red-500"
                                                        />
                                                    </Button>
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            {isHost && addMemberWidget()}
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <div className="flex justify-between w-full">
                        {isHost && (
                            <ConfirmDialog
                                message={`Are you sure you want to delete this project?`}
                                onCancel={() => {}}
                                onConfirm={async () => {
                                    await handleDeleteProject();
                                }}
                                triggerBtn={
                                    <Button className="bg-tertiary hover:bg-red-700" disabled={isLoading}>
                                        {isLoading ? <Loader2Icon className="animate-spin" /> : 'Delete Project'}
                                    </Button>
                                }
                            />
                        )}
                        <div>
                            <DialogClose asChild className="mr-2">
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            {isHost && (
                                <ConfirmDialog
                                    message={`Are you sure you want to save the changes to this project?`}
                                    onCancel={() => {}}
                                    onConfirm={async () => {
                                        await handleUpdateProject();
                                    }}
                                    triggerBtn={
                                        <Button className="bg-button" disabled={!isChanged}>
                                            {isLoading ? <Loader2Icon className="animate-spin" /> : 'Save Update'}
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ProjectDetailModal;
