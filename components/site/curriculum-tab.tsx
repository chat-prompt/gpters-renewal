import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/accordion";

interface CurriculumItem {
  key: string;
  title: string;
  children: ReactNode;
}

interface CurriculumTabProps {
  items: CurriculumItem[];
  defaultOpen?: string[];
}

export function CurriculumTab({ items, defaultOpen = [] }: CurriculumTabProps) {
  return (
    <section>
      <Accordion items={items} defaultOpen={defaultOpen} />
    </section>
  );
}
