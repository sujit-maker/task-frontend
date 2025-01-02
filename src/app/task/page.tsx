import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import TaskTable from './TasktTable';

export default function Vendors() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <TaskTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
