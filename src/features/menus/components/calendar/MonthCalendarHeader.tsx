import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthCalendarHeaderProps {
    title?: string;
    monthName: string;
    onNextMonth: () => void;
    onPrevMonth: () => void;
    onToday: () => void;
}

export function MonthCalendarHeader({
    title,
    monthName,
    onNextMonth,
    onPrevMonth,
    onToday,
}: MonthCalendarHeaderProps) {
    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    {title && <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-zinc-100 rounded-md p-1 dark:bg-zinc-800">
                        <Button
                            variant="ghost"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 p-0"
                            onClick={onPrevMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                            onClick={onToday}
                        >
                            Hoy
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 p-0"
                            onClick={onNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                        {monthName}
                    </h2>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-px">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-zinc-500 py-2">
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
