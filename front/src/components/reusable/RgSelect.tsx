import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import "./RgSelect.css";

export type RgSelectOption = { label: string; value: string };

export type RgSelectProps = {
  id: string;
  name: string;
  required?: boolean;
  options: RgSelectOption[];
  defaultValue?: string;
  className?: string;
};

export default function RgSelect({
  id,
  name,
  required = false,
  options,
  defaultValue = "",
  className = "",
}: RgSelectProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [maxHeightPx, setMaxHeightPx] = useState<number>(288);
  const [value, setValue] = useState<string>(defaultValue);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!open) return;
      const wrap = wrapRef.current;
      const menu = menuRef.current;
      if (!wrap) return;
      if (!(e.target instanceof Node)) return;
      const insideWrap = wrap.contains(e.target);
      const insideMenu = menu ? menu.contains(e.target) : false;
      if (!insideWrap && !insideMenu) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const compute = () => {
      const rect = wrap.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      const menuNatural = Math.min(menuRef.current?.scrollHeight ?? 320, 360);

      const shouldOpenUp =
        spaceBelow < Math.min(menuNatural, 320) + 12 && spaceAbove > spaceBelow;
      setOpenUp(shouldOpenUp);

      const available = Math.max(
        160,
        (shouldOpenUp ? spaceAbove : spaceBelow) - 16,
      );
      const clampedH = Math.min(menuNatural, available);
      setMaxHeightPx(clampedH);

      const left = Math.max(12, Math.min(rect.left, window.innerWidth - rect.width - 12));
      const width = rect.width;
      const style: React.CSSProperties = shouldOpenUp
        ? { left, width, bottom: viewportH - rect.top + 10 }
        : { left, width, top: rect.bottom + 10 };

      setMenuStyle(style);
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open]);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? options[0]?.label ?? "";
  }, [options, value]);

  return (
    <div
      ref={wrapRef}
      className={[
        "rg-select",
        open ? "rg-select--open" : "",
        openUp ? "rg-select--up" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--rg-select-max-h" as never]: `${maxHeightPx}px`,
        } as React.CSSProperties
      }
    >
      <button
        id={id}
        type="button"
        className="rg-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}__listbox`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`rg-select__value${value ? "" : " is-placeholder"}`}>
          {selectedLabel}
        </span>
        <ChevronDown size={22} className="rg-select__chev" aria-hidden="true" />
      </button>

      {/* keep a real select for semantics/form data */}
      <select
        className="rg-select__native"
        name={name}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-hidden="true"
        tabIndex={-1}
      >
        {options.map((o) => (
          <option key={`${o.value}-${o.label}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {createPortal(
        <div
          id={`${id}__listbox`}
          className={`rg-select__menu rg-select__menu--portal${
            open ? " is-open" : ""
          }`}
          role="listbox"
          aria-label="Options"
          ref={menuRef}
          style={
            {
              ...menuStyle,
              ["--rg-select-max-h" as never]: `${maxHeightPx}px`,
            } as React.CSSProperties
          }
        >
          {options.map((o) => (
            <button
              key={`${o.value}-${o.label}`}
              type="button"
              role="option"
              aria-selected={value === o.value}
              className={`rg-select__opt${value === o.value ? " is-active" : ""}`}
              onClick={() => {
                setValue(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

