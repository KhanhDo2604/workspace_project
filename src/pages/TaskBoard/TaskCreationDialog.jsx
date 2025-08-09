import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { typeColorMap } from '../../constants/color';
import assets from '../../constants/icon';
import { useDispatch } from 'react-redux';
import { dialogActions } from '../../store/slices/DialogSlice';
import Dropdown from '../../components/Dropdown';

const types = ['development', 'design', 'testing'];
const members = ['Alice', 'Bob', 'Charlie'];

function TaskCreationDialog() {
    const dispatch = useDispatch();

    return (
        <div className="size-full flex items-center justify-center relative">
            <div className="bg-white h-fit w-1/3 p-6 rounded-xl shadow-lg absolute z-50">
                <form>
                    <FormField isRequired={true} placeholder={'What needs to be done?'} widthFull className="px-2" />

                    <div className="w-full">
                        <div className="my-4 gap-2 flex flex-wrap">
                            {types.map((type, index) => (
                                <span
                                    key={index}
                                    className={`px-2 py-1 text-base rounded-full font-bold ${
                                        typeColorMap[type] || 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center w-full">
                        <FormField placeholder={'Type'} className="flex-1 mr-2 px-2" widthFull />
                        <Button variant="text">
                            <FontAwesomeIcon icon={assets.icon.check} size="xl" className="text-stroke" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <Dropdown options={members} placeholder="Assign to" />
                        <Button variant="text">
                            <img src={assets.icon.enter} alt="enter" className="w-6 h-6" />
                        </Button>
                    </div>
                </form>
            </div>
            <div
                className="absolute inset-0 bg-black/20"
                onClick={() => dispatch(dialogActions.closeTaskCreationDialog())}
            />
        </div>
    );
}

export default TaskCreationDialog;
