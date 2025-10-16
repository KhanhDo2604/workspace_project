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
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assets from '../../constants/icon';
import { CalendarButton } from '../CalendarButton';

const DEFAULT_TYPES = ['development', 'design', 'testing'];

export function CreateTaskModal({ triggerBtn, onSave }) {
    // Local state for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignees, setAssignees] = useState([]);
    const [types, setTypes] = useState([]);
    const [startDate, setStartDate] = useState();
    const [dueDate, setDueDate] = useState();
    const [open, setOpen] = useState(false);

    // Retrieve the current project from Redux store
    const currentProject = useSelector((state) => state.project.currentProject);

    /**
     * Reset the task creation form to its default state.
     * Called after a successful task creation or when modal is closed.
     */
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setAssignees([]);
        setTypes([]);
        setStartDate('');
        setDueDate('');
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    resetForm();
                }
            }}
        >
            <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="mb-4">
                    <DialogTitle>Create new task</DialogTitle>
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
                                    {DEFAULT_TYPES.map((type) => (
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
                            value={startDate}
                            onChange={(date) => {
                                const timestamp = date / 1000;
                                if (dueDate && timestamp > dueDate) {
                                    alert('Start date cannot be after Due date');
                                    return;
                                }
                                setStartDate(timestamp);
                            }}
                        />
                    </div>

                    {/* Due Date */}
                    <div className="grid gap-3">
                        <h1 className="text-lg font-semibold">Due Date</h1>

                        <CalendarButton
                            value={dueDate}
                            onChange={(date) => {
                                const timestamp = date / 1000;
                                if (startDate && timestamp < startDate) {
                                    alert('Due date cannot be before Start date');
                                    return;
                                }
                                setDueDate(timestamp);
                            }}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        className="bg-button"
                        onClick={() => {
                            if (!title || !description || !startDate || !dueDate) {
                                alert('Please fill in all required fields.');
                                return;
                            }
                            onSave({
                                project: currentProject.id,
                                title: title,
                                description: description,
                                assignees: assignees,
                                types: types,
                                startDay: startDate,
                                dueDay: dueDate,
                            });
                            setOpen(false);
                            resetForm();
                        }}
                    >
                        Create Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
