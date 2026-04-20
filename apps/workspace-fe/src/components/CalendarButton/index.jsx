import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

export function CalendarButton({ value, onChange, placeholder, showTime = true }) {
    const [open, setOpen] = useState(false);
    const [dateTime, setDateTime] = useState(value ? new Date(value * 1000) : null);

    useEffect(() => {
        setDateTime(value ? new Date(value * 1000) : null);
    }, [value]);

    function updateTimestamp(newDateTime) {
        if (!newDateTime) return;
        const timestamp = Math.floor(newDateTime.getTime());
        onChange?.(timestamp);
    }

    function formatDateTime(dateObj) {
        if (!dateObj) return placeholder || 'Select date';
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const hourStr = String(hours).padStart(2, '0');
        const minuteStr = String(minutes).padStart(2, '0');

        return showTime ? `${day}-${month}-${year}, ${hourStr}:${minuteStr}${ampm}` : `${day}-${month}-${year}`;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    className="justify-between font-normal w-full border border-gray-300 rounded-md shadow-none"
                    data-testid="calendar-trigger"
                >
                    {formatDateTime(dateTime)}
                    <CalendarIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 space-y-3" align="start">
                <Calendar
                    mode="single"
                    selected={dateTime === null ? new Date() : dateTime}
                    onSelect={(newDate) => {
                        if (newDate) {
                            const updated = new Date(newDate);
                            if (dateTime) {
                                updated.setHours(dateTime.getHours(), dateTime.getMinutes());
                            }
                            setDateTime(updated);
                            updateTimestamp(updated);
                        }
                    }}
                />
                {showTime && (
                    <input
                        type="time"
                        className="border rounded px-2 py-1 w-full text-base"
                        value={
                            dateTime
                                ? `${String(dateTime.getHours()).padStart(2, '0')}:${String(
                                      dateTime.getMinutes(),
                                  ).padStart(2, '0')}`
                                : `${String(new Date().getHours()).padStart(2, '0')}:${String(
                                      new Date().getMinutes(),
                                  ).padStart(2, '0')}`
                        }
                        onChange={(e) => {
                            let time = dateTime;
                            if (!dateTime) {
                                time = new Date();
                            }
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const updated = new Date(time);
                            updated.setHours(hours, minutes, 0, 0);

                            setDateTime(updated);
                            updateTimestamp(updated);
                        }}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}
