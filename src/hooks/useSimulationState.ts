import { useState } from 'react';

export function useSimulationState() {
  const [isExplainActive, setIsExplainActive] = useState(false);
  const [isGenerateActive, setIsGenerateActive] = useState(false);
  const [isDebugActive, setIsDebugActive] = useState(false);

  const handleExplainClick = () => {
    setIsExplainActive(!isExplainActive);
    setIsGenerateActive(false);
    setIsDebugActive(false);
  };

  const handleGenerateClick = () => {
    setIsGenerateActive(!isGenerateActive);
    setIsExplainActive(false);
    setIsDebugActive(false);
  };

  const handleDebugClick = () => {
    setIsDebugActive(!isDebugActive);
    setIsExplainActive(false);
    setIsGenerateActive(false);
  };

  return {
    isExplainActive,
    isGenerateActive,
    isDebugActive,
    setIsExplainActive,
    setIsGenerateActive,
    setIsDebugActive,
    handleExplainClick,
    handleGenerateClick,
    handleDebugClick,
  };
}
