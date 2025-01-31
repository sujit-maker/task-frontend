import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DepartmentTable from './departmentTable';

export default function ServiceType() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <DepartmentTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
