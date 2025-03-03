"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
}

export function CustomDatePicker({
  selected,
  onChange,
  placeholderText,
}: CustomDatePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale={id}
      dateFormat="dd/MM/yyyy"
      customInput={
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected
            ? format(selected, "dd/MM/yyyy")
            : placeholderText || "Pilih tanggal"}
        </Button>
      }
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
}
