import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { typeColorMap } from '../../constants/color';
// import { toTimestamp } from '../../constants/common';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTask } from '../../store/slices/ProjectSlice';
import ConfirmDialog from '../ConfirmDialog';
import { Loader2Icon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CalendarButton } from '../CalendarButton';
import assets from '../../constants/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UpdateTaskModal({ triggerBtn, currentTask }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(currentTask.title || '');
    const [description, setDescription] = useState(currentTask.description || '');
    const [assignees, setAssignees] = useState(currentTask.userIds || []);
    const [types, setTypes] = useState(currentTask.types || []);
    const [startDate, setStartDate] = useState(currentTask.startDay || '');
    const [dueDate, setDueDate] = useState(currentTask.dueDay || '');
    const [open, setOpen] = useState(false);

    const isLoading = useSelector((state) => state.project.loading);
    const currentProject = useSelector((state) => state.project.currentProject);

    const checkTimeType = (time) => {
        return typeof time === 'number' ? time : new Date(time).getTime() / 1000;
    };

    const handleUpdateTask = async () => {
        if (!title || !description || !startDate || !dueDate) {
            alert('Please fill in all required fields.');
            return;
        }

        await dispatch(
            updateTask({
                id: currentTask.id,
                title: title,
                description: description,
                startDay: checkTimeType(startDate),
                dueDay: checkTimeType(dueDate),
                userIds: assignees.map((m) => m._id),
                types: types,
            }),
        ).unwrap();
        toast.success('Task updated successfully');
        setOpen(false);
    };

    const handleRemoveTask = async () => {
        if (!currentTask.id) {
            alert('Task ID is missing');
            return;
        }

        await dispatch(deleteTask(currentTask.id)).unwrap();
        toast.success('Task deleted successfully');
        setOpen(false);
    };

    const isChanged =
        title !== currentTask.title ||
        description !== currentTask.description ||
        startDate !== currentTask.startDay ||
        dueDate !== currentTask.dueDay ||
        assignees.length !== currentTask.userIds.length ||
        types.length !== currentTask.types.length;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)} s>
            <Toaster position="top-right" reverseOrder={false} />
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                    <DialogTitle>Task # {currentTask.id}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    {/* Task Name */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Task Name</h1>
                        <Input id="name-1" name="name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    {/* Description */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Description</h1>
                        <Input
                            id="description-1"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {/* Assignees */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Assignees</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full border border-gray-300 rounded-md">
                                <Button
                                    variant="outline"
                                    className="w-full border-none flex flex-wrap gap-2 justify-start shadow-none"
                                >
                                    {assignees.length > 0
                                        ? assignees.map((m) => (
                                              <span
                                                  key={m._id}
                                                  className="px-3 py-1 bg-gray-200 text-base text-gray-800 rounded-full flex items-center"
                                              >
                                                  {m.name}

                                                  <button
                                                      className="ml-1 text-red-500 hover:text-red-700 p-0 m-0"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setAssignees((prev) => prev.filter((x) => x._id !== m._id));
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
                                    {currentProject.participants.map((member) => (
                                        <DropdownMenuItem
                                            key={member._id}
                                            className="cursor-pointer text-base flex justify-between"
                                            onClick={() =>
                                                setAssignees((prev) =>
                                                    prev.find((m) => m._id === member._id)
                                                        ? prev.filter((m) => m._id !== member._id)
                                                        : [...prev, member],
                                                )
                                            }
                                        >
                                            {member.name}
                                            {assignees.find((m) => m._id === member._id) && (
                                                <span className="text-green-500 font-bold">✓</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* Types */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Types</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full border border-gray-300 rounded-md">
                                <Button
                                    variant="outline"
                                    className="w-full border-none flex flex-wrap gap-2 justify-start shadow-none"
                                >
                                    {types.length > 0
                                        ? types.map((type, i) => (
                                              <span
                                                  key={i}
                                                  className={`px-3 py-2 rounded-full text-base flex items-center ${
                                                      typeColorMap[type] || 'bg-gray-200 text-gray-800'
                                                  }`}
                                              >
                                                  {type}

                                                  <button
                                                      className="ml-1 text-red-500 hover:text-red-700 flex items-center"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setTypes((prev) => prev.filter((t) => t !== type));
                                                      }}
                                                  >
                                                      <FontAwesomeIcon icon={assets.icon.close} size="sm" />
                                                  </button>
                                              </span>
                                          ))
                                        : 'Select Types'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup className="bg-white w-full max-h-60 overflow-y-auto border border-x-gray-300 rounded-b-md border-b-gray-300 ">
                                    {currentTask.types.map((type) => (
                                        <DropdownMenuItem
                                            key={type}
                                            className="cursor-pointer text-base flex justify-between"
                                            onClick={() =>
                                                setTypes((prev) =>
                                                    prev.includes(type)
                                                        ? prev.filter((t) => t !== type)
                                                        : [...prev, type],
                                                )
                                            }
                                        >
                                            {type}
                                            {types.includes(type) && (
                                                <span className="text-green-500 font-bold">✓</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Start Date */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Start Date</h1>
                        <CalendarButton
                            dateValue={new Date(startDate * 1000)}
                            onDateSelect={(date) => setStartDate(Math.floor(date.getTime() / 1000))}
                        />
                    </div>
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Due Date</h1>
                        <CalendarButton
                            dateValue={new Date(dueDate * 1000)}
                            onDateSelect={(date) => setDueDate(Math.floor(date.getTime() / 1000))}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <div className="flex justify-between w-full">
                        <ConfirmDialog
                            message={`Are you sure you want to delete this task?`}
                            onCancel={() => {}}
                            onConfirm={async () => {
                                await handleRemoveTask();
                            }}
                            triggerBtn={
                                <Button className="bg-tertiary hover:bg-red-700" disabled={isLoading}>
                                    {isLoading ? <Loader2Icon className="animate-spin" /> : 'Delete Task'}
                                </Button>
                            }
                        />
                    </div>
                    <div className="flex gap-2">
                        <DialogClose>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <ConfirmDialog
                            message={`Are you sure you want to save the changes to this project?`}
                            onCancel={() => {}}
                            onConfirm={async () => {
                                await handleUpdateTask();
                            }}
                            triggerBtn={
                                <Button className="bg-button" disabled={!isChanged}>
                                    {isLoading ? <Loader2Icon className="animate-spin" /> : 'Update Task'}
                                </Button>
                            }
                        />
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateTaskModal;
