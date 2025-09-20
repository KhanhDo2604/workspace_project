import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

export function CalendarButton({ dateValue, onDateSelect }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(dateValue);

    return (
        <div className="flex flex-col gap-3 w-full">
            <Popover open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
                <PopoverTrigger>
                    <Button
                        variant="outline"
                        id="date"
                        className="justify-between font-normal w-full border border-gray-300 rounded-md shadow-none"
                    >
                        {date ? date.toLocaleDateString() : 'Select date'}
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(newDate) => {
                            if (newDate) {
                                setDate(newDate);
                                if (onDateSelect) onDateSelect(newDate);
                            }
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
