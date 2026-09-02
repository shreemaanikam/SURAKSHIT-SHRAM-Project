import React, { useState, useEffect } from 'react';
import { SurakshitHeader, ActiveSection, UserRole } from './components/layout/SurakshitHeader';
import { CompaniesSection } from './views/sections/CompaniesSection';
import { InspectorSection } from './views/sections/InspectorSection';
import { GovernmentSection } from './views/sections/GovernmentSection';
import { GigWorkersSection } from './views/sections/GigWorkersSection';
import { SmallBusinessSection } from './views/sections/SmallBusinessSection';
import { ComplaintsSection } from './views/sections/ComplaintsSection';
import { GovFooter } from './components/layout/GovFooter';
import { Language } from './services/languageService';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('companies');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('company');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Handle hash change from URL or external navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash === 'companies' ||
        hash === 'inspector' ||
        hash === 'government' ||
        hash === 'gigworkers' ||
        hash === 'smallbiz' ||
        hash === 'complaints'
      ) {
        setActiveSection(hash as ActiveSection);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectSection = (section: ActiveSection) => {
    setActiveSection(section);
    window.location.hash = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Official Government Header with Emblem, Title, Navigation Tabs, Role Switcher & AI Bhashini Translate */}
      <SurakshitHeader
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentUserRole={currentUserRole}
        onRoleChange={handleRoleChange}
      />

      {/* 2. Main Content Area Rendering the Active Separate Section */}
      <main className="flex-1 w-full pb-12">
        {activeSection === 'companies' && <CompaniesSection />}
        {activeSection === 'inspector' && <InspectorSection />}
        {activeSection === 'government' && <GovernmentSection />}
        {activeSection === 'gigworkers' && <GigWorkersSection />}
        {activeSection === 'smallbiz' && <SmallBusinessSection />}
        {activeSection === 'complaints' && <ComplaintsSection />}
      </main>

      {/* 3. Official Government Footer */}
      <GovFooter />
    </div>
  );
}
