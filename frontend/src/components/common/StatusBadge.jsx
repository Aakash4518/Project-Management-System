import clsx from "clsx";
import { statusTone } from "../../utils/helpers";

export const StatusBadge = ({ children, tone }) => (
  <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize", statusTone(tone || children))}>
    {children}
  </span>
);
