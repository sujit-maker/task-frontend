import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import TaskTypeTable from './TaskTypeTable';

export default function Vendors() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <TaskTypeTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
