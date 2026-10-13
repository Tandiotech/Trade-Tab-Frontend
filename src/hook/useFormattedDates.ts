import { useEffect, useState } from 'react';

interface useFormattedDatesConfig {
  initialValues?: {
    startDate: string | null;
    endDate: string | null;
  };
}

interface FormattedDates {
  dateStartFilterFormatted: string;
  dateEndFilterFormatted: string;
  dateStartFilter: string | null;
  dateEndFilter: string | null;
  setDateEndFilter: React.Dispatch<React.SetStateAction<string | null>>;
  setDateStartFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useFormattedDates(config: useFormattedDatesConfig): FormattedDates {
  const initialValues = config.initialValues;

  // Obtener el año actual dinámicamente
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleDateString('en-GB', { month: '2-digit' });
  const currentDay = currentDate.toLocaleDateString('en-GB', { day: '2-digit' });

  // Establecer la fecha inicial al 1 de enero del año actual
  const initialDateStartFilter =
    initialValues?.startDate === undefined ? `${currentYear}-01-01` : initialValues.startDate;
  // Establecer la fecha final como la fecha actual
  const initialDateEndFilter =
    initialValues?.endDate === undefined
      ? `${currentYear}-${currentMonth}-${currentDay}`
      : initialValues.endDate;

  const [dateStartFilter, setDateStartFilter] = useState<string | null>(initialDateStartFilter);
  const [dateEndFilter, setDateEndFilter] = useState<string | null>(initialDateEndFilter);

  const [dateStartFilterFormatted, setDateFormattedStartFilter] = useState('');
  const [dateEndFilterFormatted, setDateFormattedEndFilter] = useState('');

  useEffect(() => {
    if (dateStartFilter && dateEndFilter) {
      // Crear un objeto Date a partir de la cadena de fecha original
      const date_start = new Date(dateStartFilter);
      const date_end = new Date(dateEndFilter);

      // Formatear las fechas a YYYY-MM-DD
      const formattedDate_start = date_start.toISOString().split('T')[0];
      const formattedDate_end = date_end.toISOString().split('T')[0];

      // Actualizar los estados de las fechas formateadas
      setDateFormattedStartFilter(formattedDate_start);
      setDateFormattedEndFilter(formattedDate_end);
    } else {
      setDateFormattedStartFilter('');
      setDateFormattedEndFilter('');
    }
  }, [dateStartFilter, dateEndFilter]);

  return {
    dateStartFilterFormatted,
    dateEndFilterFormatted,
    setDateStartFilter,
    setDateEndFilter,
    dateStartFilter,
    dateEndFilter,
  };
}
