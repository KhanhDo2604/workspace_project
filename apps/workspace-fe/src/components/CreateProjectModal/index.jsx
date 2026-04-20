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

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState({ title: '', description: '' });

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
        setError({ title: '', description: '' });
    };

    const validate = () => {
        const newErrors = { title: '', description: '' };
        if (!title.trim()) newErrors.title = 'Project name is required.';
        if (!description.trim()) newErrors.description = 'Description is required.';
        setError(newErrors);
        return !newErrors.title && !newErrors.description;
    };

    const createNewProject = async () => {
        if (!validate()) {
            return;
        }
        await dispatch(
            createProject({
                title: title,
                description: description,
                userId: user.id,
                color: randomColor(),
            }),
        ).unwrap();
        resetForm();
        setOpen(false);
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
                    }}
                >
                    <DialogHeader className="mb-4">
                        <DialogTitle>Create new project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            {/* <h1 className="text-lg font-semibold">Project Name</h1> */}
                            <label htmlFor="name-1" className="text-lg font-semibold">
                                Project Name
                            </label>
                            <Input
                                id="name-1"
                                name="name"
                                data-testid="project-name-input"
                                value={title}
                                error={error.title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (error.title) setError((prev) => ({ ...prev, title: '' }));
                                }}
                            />
                        </div>
                        <div className="grid gap-3">
                            {/* <h1 className="text-lg font-semibold">Description</h1> */}
                            <label htmlFor="description-1" className="text-lg font-semibold">
                                Description
                            </label>
                            <Input
                                id="description-1"
                                name="description"
                                data-testid="project-desc-input"
                                value={description}
                                error={error.description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (error.description) setError((prev) => ({ ...prev, description: '' }));
                                }}
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
