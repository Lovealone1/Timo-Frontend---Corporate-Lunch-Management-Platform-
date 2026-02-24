import React, { useState, useEffect } from 'react';
import { Menu } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Drumstick, Salad, Check, Loader2, Pencil, Trash2 } from 'lucide-react';
import { reservationService } from '@/services/reservation-service';

interface MenuCardProps {
    date: Date;
    menu: Menu | null;
    isLoading: boolean;
    cedula: string;
    onReservationSuccess: () => void;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function MenuCard({ date, menu, isLoading, cedula, onReservationSuccess }: MenuCardProps) {
    const [selectedProteinId, setSelectedProteinId] = useState<string | null>(null);
    const [isReserving, setIsReserving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reservationError, setReservationError] = useState<string | null>(null);

    // Initialize the selected protein if there is a reservation
    useEffect(() => {
        if (menu?.reservedProteinId) {
            setSelectedProteinId(menu.reservedProteinId);
        }
    }, [menu?.reservedProteinId]);

    const dayName = DAYS[date.getDay()];
    const dateString = `${date.getDate()} de ${MONTHS[date.getMonth()]}`;

    if (isLoading) {
        return (
            <Card className="h-full flex flex-col w-full min-w-0 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="flex-1 p-5 flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin"></div>
                </CardContent>
            </Card>
        );
    }

    if (!menu) {
        return (
            <Card className="h-full flex flex-col w-full min-w-0 border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/50 opacity-60">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="text-lg font-bold tracking-tight">{dayName}</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-wider">{dateString}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-2">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                        No hay menú <br /> disponible para este día
                    </p>
                </CardContent>
            </Card>
        );
    }

    const { id: menuId, drink, defaultProteinType, proteinOptions, sideOptions, status, hasReservation, reservationId, reservedProteinId } = menu;
    const isServed = status === 'SERVED';
    const showReservedState = hasReservation && !isServed && !isEditing;
    const isLocked = isServed || showReservedState;

    // Preparar lista de proteínas evitando duplicados
    const allProteinsRaw = [
        defaultProteinType ? { id: defaultProteinType.id, name: defaultProteinType.name } : null,
        ...(proteinOptions?.map(p => ({ id: p.proteinType.id, name: p.proteinType.name })) || [])
    ].filter(Boolean) as { id: string, name: string }[];

    const allProteins = Array.from(new Map(allProteinsRaw.map(p => [p.id, p])).values());

    const handleReserve = async () => {
        if (!selectedProteinId || isReserving) return;
        setIsReserving(true);
        setReservationError(null);
        try {
            if (isEditing && reservationId) {
                await reservationService.update(reservationId, {
                    cc: cedula,
                    proteinTypeId: selectedProteinId
                });
                setIsEditing(false);
            } else {
                await reservationService.create({
                    cc: cedula,
                    menuId,
                    proteinTypeId: selectedProteinId
                });
            }
            onReservationSuccess();
        } catch (error) {
            setReservationError(isEditing ? 'No se pudo actualizar la reserva.' : 'No se pudo completar la reserva.');
        } finally {
            setIsReserving(false);
        }
    };

    const performDeleteReservation = async () => {
        if (!reservationId || isDeleting) return;

        setIsDeleting(true);
        setReservationError(null);
        try {
            await reservationService.deleteReservation(reservationId, cedula);
            setIsEditing(false);
            setShowDeleteConfirm(false);
            setSelectedProteinId(null);
            onReservationSuccess();
        } catch (error) {
            setReservationError('No se pudo eliminar la reserva.');
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className={`h-full flex flex-col w-full min-w-0 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-200 ${isServed ? 'bg-zinc-50 dark:bg-zinc-950 opacity-70 grayscale-[0.2]' : 'bg-white dark:bg-zinc-900 ' + (showReservedState ? 'border-zinc-300 dark:border-zinc-700' : 'hover:shadow-md')}`}>
            <CardHeader className={`pb-3 border-b border-zinc-100 dark:border-zinc-800 relative ${showReservedState ? 'bg-zinc-100 dark:bg-zinc-800/80' : 'bg-zinc-50 dark:bg-zinc-900/50'}`}>
                <CardTitle className={`text-lg font-bold tracking-tight ${isServed ? 'text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {dayName}
                </CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {dateString}
                </CardDescription>

                {isServed && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded-full">
                        Servido
                    </span>
                )}

                {showReservedState && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-1 rounded-full">
                            Reservaste
                        </span>
                        <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden disabled:opacity-50">
                            <button
                                onClick={() => setIsEditing(true)}
                                disabled={isDeleting}
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Editar reserva"
                            >
                                <Pencil size={14} />
                            </button>
                            <div className="w-px bg-zinc-200 dark:bg-zinc-700"></div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isDeleting}
                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                                title="Eliminar reserva"
                            >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/50 px-2 py-1 rounded-full">
                        Editando
                    </span>
                )}
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                {/* Bebida Block */}
                <div className={`p-4 flex flex-col gap-2 transition-colors ${!isLocked && 'group hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-1">
                        <Coffee size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Bebida</span>
                    </div>
                    <p className={`text-sm font-medium ${(isServed || showReservedState) ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {drink ? drink.name : 'No especificada'}
                    </p>
                </div>

                {/* Proteína Block */}
                <div className={`p-4 flex flex-col gap-2 transition-colors ${!isLocked && 'group hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-1">
                        <Drumstick size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Proteínas</span>
                    </div>
                    {allProteins.length > 0 ? (
                        <div className="space-y-2 mt-1">
                            {allProteins.map((p) => {
                                const isSelected = selectedProteinId === p.id;

                                // Determinar estilos condicionales
                                let buttonClass = 'border-transparent text-zinc-500 dark:text-zinc-400 cursor-default px-0'; // Default para bloqueados no seleccionados

                                if (showReservedState && isSelected) {
                                    // Highlight para la proteína reservada
                                    buttonClass = 'border-emerald-500/50 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-sm px-3';
                                } else if (!isLocked) {
                                    // Modos interactivos
                                    if (isSelected) {
                                        buttonClass = 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm px-3';
                                    } else {
                                        buttonClass = 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3';
                                    }
                                }

                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => !isLocked && setSelectedProteinId(p.id)}
                                        disabled={isLocked}
                                        className={`w-full flex items-center justify-between text-left text-sm font-medium py-2 rounded-md border transition-all ${buttonClass}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isLocked && !isSelected && <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>}
                                            {p.name}
                                        </span>
                                        {isSelected && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-zinc-500 italic">No especificadas</p>
                    )}
                </div>

                {/* SideDishes Block */}
                <div className={`p-4 flex flex-col gap-2 transition-colors ${!isLocked && 'group hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-1">
                        <Salad size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Acompañamientos</span>
                    </div>
                    {sideOptions && sideOptions.length > 0 ? (
                        <ul className="space-y-1.5 mt-1">
                            {sideOptions.map((s, idx) => (
                                <li key={idx} className={`text-sm font-medium flex items-center gap-2 ${(isServed || showReservedState) ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                                    {s.sideDish.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm font-medium text-zinc-500 italic">No especificados</p>
                    )}
                </div>
            </CardContent>

            {/* Acciones de Reserva */}
            {!isServed && !showReservedState && (
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 mt-auto flex flex-col gap-3">
                    {reservationError && (
                        <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                            {reservationError}
                        </p>
                    )}

                    <Button
                        className="w-full font-bold uppercase tracking-wider text-xs"
                        disabled={!selectedProteinId || isReserving}
                        onClick={handleReserve}
                    >
                        {isReserving ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 size={14} className="animate-spin" />
                                Guardando...
                            </span>
                        ) : (isEditing ? 'Guardar Cambios' : 'Reservar')}
                    </Button>

                    {isEditing && (
                        <Button
                            variant="outline"
                            className="w-full text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-transparent dark:bg-transparent"
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedProteinId(reservedProteinId || null);
                                setReservationError(null);
                            }}
                            disabled={isReserving}
                        >
                            Cancelar edición
                        </Button>
                    )}
                </div>
            )}

            {/* Modal de Confirmación de Eliminación Personalizado */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-[2px] rounded-xl flex-col">
                    <div className="w-56 p-4 shadow-xl border border-red-200/50 dark:border-red-900/30 bg-white dark:bg-zinc-900 rounded-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3 text-red-600 dark:text-red-500">
                            <Trash2 size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 leading-tight text-center">¿Eliminar Reserva?</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-5 leading-relaxed">
                            Puedes quedarte sin proteína asignada.
                        </p>
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 text-[10px] h-8 font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 px-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1 text-[10px] h-8 font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white border-none px-0 shadow-sm"
                                onClick={performDeleteReservation}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 size={12} className="animate-spin" /> : 'Eliminar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
