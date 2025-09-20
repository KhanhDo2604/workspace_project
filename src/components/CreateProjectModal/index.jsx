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

function CreateProjectModal({ triggerBtn }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const userId = localStorage.getItem('user_id');

    const isLoading = useSelector((state) => state.project.loading);

    const resetForm = () => {
        setTitle('');
        setDescription('');
    };

    const createNewProject = async () => {
        await dispatch(
            createProject({
                title: title,
                projectName: description,
                userId: userId,
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
            <DialogContent className="sm:max-w-[425px]">
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
