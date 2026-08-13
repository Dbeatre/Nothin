import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function MindMap({ mermaidSyntax }) {
  const containerRef = useRef(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!mermaidSyntax || !containerRef.current) return;

    mermaid.initialize({
      theme: 'dark',
      themeVariables: {
        background: 'transparent',
        primaryColor: '#8B5CF6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#22D3EE',
        lineColor: '#22D3EE',
        secondaryColor: '#2d3748',
        tertiaryColor: '#1a202c',
      },
      flowchart: { useMaxWidth: true, htmlLabels: true },
    });

    const render = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', mermaidSyntax);
        containerRef.current.innerHTML = svg;
        setRenderError(false);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setRenderError(true);
      }
    };

    render();
  }, [mermaidSyntax]);

  if (renderError) {
    return (
      <div className="text-sm text-white/40 p-4 border border-white/10 rounded-xl">
        Could not render mind map. Please check the syntax.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto flex justify-center min-h-[200px]"
      style={{ maxHeight: '400px' }}
    />
  );
}
