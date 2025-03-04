import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function BasicDatePicker({ values, onChange, ...props }) {
  // Convert the value to a dayjs object if it exists, or set it to null
  const formattedValue = values ? dayjs(values) : null;

  // Define the minimum and maximum dates
  const minDate = dayjs('1990-01-01'); // Minimum date: January 1, 1990
  const maxDate = dayjs(); // Maximum date: Today

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      
        value={formattedValue}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        {...props} // Spread additional props for flexibility
        label="Date Picker"
      />
    </LocalizationProvider>
  );
}
