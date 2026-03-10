"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { differenceInDays, startOfDay } from "date-fns";
import { Project } from "@/lib/validations/project";

interface TimelineNotifierProps {
  urgentProjects: Project[];
}

export function TimelineNotifier({ urgentProjects }: TimelineNotifierProps) {
  // Prevent strict mode double-firing
  const hasNotified = useRef(false);

  useEffect(() => {
    if (urgentProjects.length > 0 && !hasNotified.current) {
      hasNotified.current = true;
      
      const today = startOfDay(new Date());
      
      urgentProjects.forEach(p => {
        const days = differenceInDays(startOfDay(new Date(p.deadline)), today);
        let message = "";
        let isCritical = false;

        if (days < 0) {
          message = `Project "${p.name}" is OVERDUE by ${Math.abs(days)} days!`;
          isCritical = true;
        } else if (days === 0) {
          message = `Project "${p.name}" is due TODAY!`;
          isCritical = true;
        } else if (days === 1) {
          message = `Project "${p.name}" is due TOMORROW!`;
          isCritical = true;
        } else {
          message = `Project "${p.name}" is due in ${days} days.`;
        }

        // Delay slightly for better staggered visual effect if multiple projects
        setTimeout(() => {
          if (isCritical) {
            toast.error(message, {
              duration: 5000,
              icon: "🚨",
            });
          } else {
            toast.warning(message, {
              duration: 4000,
              icon: "⚠️",
            });
          }
        }, 100);
      });
    }
  }, [urgentProjects]);

  return null; // This component doesn't render anything visible
}
