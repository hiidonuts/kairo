import {
  BookOpenCheck,
  Coffee,
  FileText,
  Home,
  LayoutGrid,
  Share2,
} from "lucide-react";
import type { MiniTabId } from "./demoData";

const ICONS: Record<Exclude<MiniTabId, "ai_chat">, typeof Home> = {
  home: Home,
  spaces: LayoutGrid,
  "notes-list": FileText,
  practice: BookOpenCheck,
  "study-room": Coffee,
  "knowledge-graph": Share2,
};

type Props = {
  id: Exclude<MiniTabId, "ai_chat">;
  size?: number;
  active?: boolean;
  hovered?: boolean;
  className?: string;
};

export function NavIcon({ id, size = 18, active, hovered, className }: Props) {
  const Icon = ICONS[id];
  return (
    <Icon
      size={size}
      strokeWidth={active || hovered ? 2.25 : 1.75}
      className={className}
    />
  );
}
