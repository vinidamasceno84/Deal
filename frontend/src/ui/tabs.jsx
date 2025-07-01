
import React, { useState } from 'react';

// Componente Tabs: container geral das abas
export function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Propagando o estado para os filhos
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { activeTab, setActiveTab });
  });

  return <div className="tabs">{childrenWithProps}</div>;
}

// Lista de Triggers (os botões que trocam de aba)
export function TabsList({ children }) {
  return <div className="tabs-list" style={{ display: 'flex', gap: '8px' }}>{children}</div>;
}

// Trigger individual de uma aba
export function TabsTrigger({ tab, activeTab, setActiveTab, children }) {
  const isActive = tab === activeTab;

  const styles = {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderBottom: isActive ? '2px solid blue' : '1px solid #ccc',
    backgroundColor: isActive ? '#f0f8ff' : '#fff',
    cursor: 'pointer'
  };

  return (
    <div
      onClick={() => setActiveTab(tab)}
      style={styles}
    >
      {children}
    </div>
  );
}

// Conteúdo da aba
export function TabsContent({ tab, activeTab, children }) {
  if (tab !== activeTab) return null;

  const styles = {
    padding: '16px',
    border: '1px solid #ccc',
    marginTop: '8px'
  };

  return (
    <div style={styles}>
      {children}
    </div>
  );
}
