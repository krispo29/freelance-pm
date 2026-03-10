export const translations = {
  en: {
    common: {
      dashboard: "Dashboard",
      projects: "Projects",
      clients: "Clients",
      income: "Income",
      timeline: "Timeline",
      settings: "Settings",
      logout: "Logout",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
    },
    dashboard: {
      welcome: "Welcome back!",
      overview: "Here's an overview of your freelance business.",
      activeProjects: "Active Projects",
      totalRevenue: "Total Revenue",
      pendingIncome: "Pending Income",
      overdue: "Overdue",
      upcomingTasks: "Upcoming Tasks",
      recentIncome: "Recent Income",
      viewAll: "View All",
      noActiveProjects: "No active projects",
      startNewProject: "Start a new project to see it here.",
      allCaughtUp: "All caught up! No upcoming tasks.",
      noRecentIncome: "No recent income entries.",
      tasksDue: "Tasks that need your attention soon",
      financialActivity: "Latest financial activity",
    },
    projects: {
      status: {
        not_started: "Not Started",
        in_progress: "In Progress",
        near_done: "Near Done",
        completed: "Completed",
        maintenance: "Maintenance",
        cancelled: "Cancelled",
      }
    }
  },
  th: {
    common: {
      dashboard: "แดชบอร์ด",
      projects: "โปรเจค",
      clients: "ลูกค้า",
      income: "รายได้",
      timeline: "ไทม์ไลน์",
      settings: "ตั้งค่า",
      logout: "ออกจากระบบ",
      add: "เพิ่ม",
      edit: "แก้ไข",
      delete: "ลบ",
      save: "บันทึก",
      cancel: "ยกเลิก",
      loading: "กำลังโหลด...",
    },
    dashboard: {
      welcome: "ยินดีต้อนรับกลับมา!",
      overview: "ภาพรวมธุรกิจฟรีแลนซ์ของคุณในวันนี้",
      activeProjects: "โปรเจคที่กำลังทำ",
      totalRevenue: "รายได้ทั้งหมด",
      pendingIncome: "รอรับเงิน",
      overdue: "ค้างชำระ",
      upcomingTasks: "งานที่ต้องทำเร็วๆ นี้",
      recentIncome: "รายรับล่าสุด",
      viewAll: "ดูทั้งหมด",
      noActiveProjects: "ไม่มีโปรเจคที่กำลังดำเนินการ",
      startNewProject: "เริ่มโปรเจคใหม่เพื่อดูข้อมูลที่นี่",
      allCaughtUp: "เยี่ยมมาก! ไม่มีงานค้างในขณะนี้",
      noRecentIncome: "ยังไม่มีรายการรายรับ",
      tasksDue: "งานที่ต้องรีบจัดการเร็วๆ นี้",
      financialActivity: "กิจกรรมทางการเงินล่าสุดของคุณ",
    },
    projects: {
      status: {
        not_started: "ยังไม่เริ่ม",
        in_progress: "กำลังทำ",
        near_done: "ใกล้เสร็จ",
        completed: "เสร็จสิ้น",
        maintenance: "ดูแลรักษา",
        cancelled: "ยกเลิก",
      }
    }
  },
};

export type Language = "en" | "th";
export type TranslationKeys = typeof translations.en;

export function getTranslation(lang: Language = "th") {
  return translations[lang] || translations.th;
}
