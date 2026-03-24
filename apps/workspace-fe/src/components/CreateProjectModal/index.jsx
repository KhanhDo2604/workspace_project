import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../store/slices/ProjectSlice';

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
import { randomColor } from '../../utils';

/**
 * This component renders a modal that allows the user
 * to create a new project within the Collaborative Workspace.
 */
function CreateProjectModal({ triggerBtn }) {
    const dispatch = useDispatch();

    // Local state for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Modal open/close state
    const [open, setOpen] = useState(false);

    // Loading state from Redux store for showing spinner or disabling UI
    const isLoading = useSelector((state) => state.project.loading);
    const user = useSelector((state) => state.auth.user);

    /**
     * Clears all input fields in the form when the modal
     * is closed or after the project is successfully created.
     */
    const resetForm = () => {
        setTitle('');
        setDescription('');
    };

    /**
     * Dispatches an asynchronous Redux action to create
     * a new project in the backend database. The function
     * automatically unwraps the promise to handle rejections.
     * It also assigns a random color to the project for UI labeling.
     */
    const createNewProject = async () => {
        await dispatch(
            createProject({
                title: title,
                description: description,
                userId: user.id,
                color: randomColor(), // Assigns a random UI color
            }),
        ).unwrap();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) resetForm();
            }}
        >
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await createNewProject();
                        resetForm();
                        setOpen(false);
                    }}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create new project</DialogTitle>
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
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-button">
                            {isLoading ? <Loader2Icon className="animate-spin" /> : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProjectModal;
