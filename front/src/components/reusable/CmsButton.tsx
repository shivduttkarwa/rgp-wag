import RgButton from "@/components/reusable/RgButton";
import type { ButtonBlockData } from "@/types/shared";

type Props = {
  button: ButtonBlockData;
  className?: string;
  [key: string]: unknown;
};

export default function CmsButton({ button, className, ...rest }: Props) {
  const { label, href, style = "gold", open_in_new_tab } = button;

  if (!label || !href) return null;

  if (open_in_new_tab) {
    return (
      <RgButton
        variant={style}
        href={href}
        label={label}
        className={className}
        target="_blank"
        rel="noreferrer"
        {...rest}
      />
    );
  }

  return (
    <RgButton
      variant={style}
      to={href}
      label={label}
      className={className}
      {...rest}
    />
  );
}
