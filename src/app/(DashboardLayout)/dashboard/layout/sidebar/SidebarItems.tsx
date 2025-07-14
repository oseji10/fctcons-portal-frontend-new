import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { getApplicationType, getRole } from "../../../../../lib/auth";
import { IconCreditCard, IconDeviceDesktop, IconFilePencil, IconFingerprint, IconPrinter, IconRecycle, IconRecycleOff, IconSchool, IconShoppingBag, IconUsersGroup, IconVersionsFilled } from "@tabler/icons-react";

interface SidebarItemsProps {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

// Local menu data based on role
const MENU_CONFIG: Record<string, any[]> = {
  admin: [
    // { id: "dashboard", title: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
    { subheader: "Admin Dashboard" },
    {
      id: "users",
      title: "JAMB Data",
      icon: IconDeviceDesktop,
      href: "/dashboard/jamb",
    },
       {
      id: "applications",
      title: "Applications",
      icon: IconFilePencil,
      href: "/dashboard/applications",
    },
       {
      id: "batches",
      title: "Batches",
      icon: IconRecycle,
      href: "/dashboard/batches",
    },
       {
      id: "batched-applicants",
      title: "Batched Applicants",
      icon: IconRecycleOff,
      href: "/dashboard/batched-applicants",
    },
       {
      id: "verification",
      title: "Verification",
      icon: IconFingerprint,
      href: "/dashboard/verification",
    },
       {
      id: "attendance",
      title: "Attendance",
      icon: IconUsersGroup,
      href: "/dashboard/attendance",
    },

       {
      id: "payments",
      title: "Payments",
      icon: IconShoppingBag,
      href: "/dashboard/payments",
    },

       {
      id: "admissions",
      title: "Admissions",
      icon: IconSchool,
      href: "/dashboard/admissions",
    },
  ],
  candidate: [
    // { id: "overview", title: "Overview", icon: "home", href: "/client/overview" },
    { subheader: "Candidate Dashboard" },
    {
      id: "applications",
      title: "Apply Now",
      icon: IconFilePencil,
      href: "/dashboard/apply",
    },
     {
      id: "my-payments",
      title: "My Payments",
      icon: IconCreditCard,
      href: "/dashboard/my-payments",
    },
      {
      id: "my-exam-slip",
      title: "My Exam Slip",
      icon: IconPrinter,
      href: "/dashboard/my-exam-slip",
    },
  ],
  staff: [
    { id: "panel", title: "Panel", icon: "work", href: "/staff/panel" },
    {
      subheader: "Operations",
    },
    {
      id: "tasks",
      title: "Tasks",
      icon: "task",
      href: "/staff/tasks",
    },
  ],
};

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const [applicationType, setApplicationType] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const storedApplicationType = getApplicationType();
    const storedRole = getRole();

    setApplicationType(storedApplicationType);
    setRole(storedRole);

    // Use switch-case to select the menu based on role
    let selectedMenu: any[] = [];
    switch (storedRole) {
      case "ADMIN":
        selectedMenu = MENU_CONFIG.admin;
        break;
      case "CANDIDATE":
        selectedMenu = MENU_CONFIG.candidate;
        break;
      case "staff":
        selectedMenu = MENU_CONFIG.staff;
        break;
      default:
        selectedMenu = [];
        break;
    }

    setMenuItems(selectedMenu);
  }, []);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {role === null ? (
          <Box sx={{ px: 3, py: 1, color: "text.secondary" }}>
            <Typography>Loading menu...</Typography>
          </Box>
        ) : menuItems.length === 0 ? (
          <Box sx={{ px: 3, py: 1, color: "text.secondary" }}>
            <Typography>No menu items available for your role</Typography>
          </Box>
        ) : (
          menuItems.map((item) => {
            if (item.subheader) {
              return <NavGroup item={item} key={item.subheader} />;
            } else {
              return (
                <NavItem
                  item={item}
                  key={item.id}
                  pathDirect={pathDirect}
                  onClick={toggleMobileSidebar}
                />
              );
            }
          })
        )}
      </List>
    </Box>
  );
};

export default SidebarItems;
