import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ServiceTypeTable from './serviceTypeTable';

export default function ServiceType() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <ServiceTypeTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
