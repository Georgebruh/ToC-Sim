import React from 'react';
import {
  Header,
  LeftSidebar,
  Canvas,
  GenerateCommandPalette,
  RightSidebar,
  BottomNavBar,
  DebugToast,
} from './components';
import { useSimulationState } from './hooks/useSimulationState';

export default function App() {
  const {
    isExplainActive,
    isGenerateActive,
    isDebugActive,
    setIsGenerateActive,
    setIsDebugActive,
    handleExplainClick,
    handleGenerateClick,
    handleDebugClick,
  } = useSimulationState();

  return (
    <div className="h-screen w-screen bg-background text-on-surface font-['Space_Grotesk'] overflow-hidden flex flex-col selection:bg-primary-container selection:text-on-primary-container relative">
      
      <Header />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        <LeftSidebar
          isExplainActive={isExplainActive}
          isGenerateActive={isGenerateActive}
          isDebugActive={isDebugActive}
          onExplainClick={handleExplainClick}
          onGenerateClick={handleGenerateClick}
          onDebugClick={handleDebugClick}
        />

        <div className="flex-1 relative">
          <Canvas isGenerateActive={isGenerateActive} isDebugActive={isDebugActive} />
          
          <GenerateCommandPalette
            isActive={isGenerateActive}
            onClose={() => setIsGenerateActive(false)}
          />
        </div>

        <RightSidebar isDebugActive={isDebugActive} />
      </div>

      <BottomNavBar />

      <DebugToast
        isActive={isDebugActive}
        onClose={() => setIsDebugActive(false)}
      />
    </div>
  );
}