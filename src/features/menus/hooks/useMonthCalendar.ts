import { useState, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, format, eachDayOfInterval, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function useMonthCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);

    // Get the Monday before or equal to the 1st of the month
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // Estandarizamos SIEMPRE a 5 semanas (35 días) para los calendarios.
    // Los días 30/31 que queden por fuera pasarán automáticamente a la vista del próximo mes.
    const calendarEnd = addDays(calendarStart, 34);

    const monthDays = useMemo(() => {
        return eachDayOfInterval({
            start: calendarStart,
            end: calendarEnd
        });
    }, [calendarStart, calendarEnd]);

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return {
        currentDate,
        monthStart,
        monthEnd,
        monthDays,
        currentMonth: monthStart,
        handleNextMonth,
        handlePrevMonth,
        handleToday,
        startDateStr: format(calendarStart, 'yyyy-MM-dd'),
        endDateStr: format(calendarEnd, 'yyyy-MM-dd'),
        monthName: format(monthStart, 'MMMM yyyy', { locale: es }),
    };
}
