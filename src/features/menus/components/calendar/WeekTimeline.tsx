import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeekTimelineProps {
    weekDays: Date[];
    monthName: string;
    onNextWeek: () => void;
    onPrevWeek: () => void;
    onToday: () => void;
}

export function WeekTimeline({
    weekDays,
    monthName,
    onNextWeek,
    onPrevWeek,
    onToday,
}: WeekTimelineProps) {
    const today = new Date();

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex bg-zinc-100 rounded-md p-1 dark:bg-zinc-800">
                        <Button
                            variant="ghost"
                            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 p-0"
                            onClick={onPrevWeek}
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
                            onClick={onNextWeek}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold capitalize text-zinc-900 dark:text-zinc-100">
                        {monthName}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {weekDays.map((date, i) => {
                    const isToday = isSameDay(date, today);
                    return (
                        <div
                            key={i}
                            className={cn(
                                "bg-white dark:bg-zinc-950 p-3 pt-4 text-center border-t-2",
                                isToday ? "border-t-orange-500" : "border-t-transparent"
                            )}
                        >
                            <div className="text-sm font-medium text-zinc-500 mb-1 capitalize">
                                {format(date, 'eee', { locale: es })}
                            </div>
                            <div
                                className={cn(
                                    "inline-flex items-center justify-center w-8 h-8 rounded-full text-lg font-semibold",
                                    isToday
                                        ? "bg-orange-500 text-white"
                                        : "text-zinc-900 dark:text-zinc-100"
                                )}
                            >
                                {format(date, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
