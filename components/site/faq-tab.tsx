import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/accordion";

interface FaqItem {
  key: string;
  title: string;
  children: ReactNode;
}

interface FaqTabProps {
  items: FaqItem[];
}

export function FaqTab({ items }: FaqTabProps) {
  return (
    <section>
      <Accordion items={items} />
    </section>
  );
}
