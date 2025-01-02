import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ServiceTable from './ServiceTable';

export default function Services() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <ServiceTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
