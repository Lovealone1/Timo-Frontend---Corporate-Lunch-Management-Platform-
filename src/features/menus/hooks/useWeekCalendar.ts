import { useState, useMemo } from 'react';
import { addDays, subDays, startOfWeek, endOfWeek, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function useWeekCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday

    const weekDays = useMemo(() => {
        const days = [];
        let day = currentWeekStart;
        while (day <= currentWeekEnd) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentWeekStart, currentWeekEnd]);

    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const handlePrevWeek = () => {
        setCurrentDate(subDays(currentDate, 7));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return {
        currentDate,
        currentWeekStart,
        currentWeekEnd,
        weekDays,
        handleNextWeek,
        handlePrevWeek,
        handleToday,
        startDateStr: format(currentWeekStart, 'yyyy-MM-dd'),
        endDateStr: format(currentWeekEnd, 'yyyy-MM-dd'),
        monthName: format(currentWeekStart, 'MMMM yyyy', { locale: es }),
    };
}
