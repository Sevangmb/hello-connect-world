
import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Background, 
  Controls, 
  Edge, 
  Node, 
  NodeChange, 
  applyNodeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './dependency-graph.css';
import { useModules } from '@/hooks/modules';
import { AppModule } from '@/hooks/modules/types';

// We need to define node types for our custom nodes
const nodeTypes = {};

interface ModuleDependencyGraphProps {
  modules?: AppModule[];
  dependencies?: any[];
  loading?: boolean;
}

export const ModuleDependencyGraph: React.FC<ModuleDependencyGraphProps> = ({
  modules = [],
  dependencies = [], 
  loading = false
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphInitialized, setGraphInitialized] = useState(false);

  // Generate graph nodes
  useEffect(() => {
    if (!loading && modules.length > 0 && dependencies.length > 0 && !graphInitialized) {
      generateGraph();
      setGraphInitialized(true);
    }
  }, [modules, dependencies, loading, graphInitialized]);

  // Update nodes when their status changes
  useEffect(() => {
    if (graphInitialized && nodes.length > 0 && modules.length > 0) {
      const updatedNodes = nodes.map(node => {
        const module = modules.find(m => m.id === node.id);
        if (module) {
          return {
            ...node,
            data: {
              ...node.data,
              status: module.status
            }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  }, [modules, graphInitialized, nodes]);

  // Generate graph layout
  const generateGraph = () => {
    try {
      // Create nodes from modules
      const flowNodes: Node[] = modules.map((module, index) => ({
        id: module.id,
        type: 'moduleNode',
        data: { 
          label: module.name,
          code: module.code,
          status: module.status,
          isCore: module.is_core,
          isAdmin: module.is_admin
        },
        position: { 
          x: 150 + (index % 3) * 300, 
          y: 100 + Math.floor(index / 3) * 200 
        }
      }));
      
      // Create edges from dependencies
      const flowEdges: Edge[] = dependencies.map((dep, index) => ({
        id: `e-${index}`,
        source: dep.module_id,
        target: dep.dependency_id,
        type: dep.is_required ? 'required' : 'optional',
        animated: dep.is_required,
        style: { 
          stroke: dep.is_required ? '#ff0000' : '#aaa',
          strokeWidth: dep.is_required ? 2 : 1
        }
      }));
      
      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Error generating graph:', error);
      // Convert error to string to avoid ReactNode type issue
      const errorMessage = error instanceof Error ? error.message : String(error);
      return <div className="error-message">Error: {errorMessage}</div>;
    }
  };

  // Handle node position changes
  const onNodesChange = (changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes));
  };

  // If loading, show a loading indicator
  if (loading) {
    return <div className="p-4 text-center">Loading module dependencies...</div>;
  }

  // If no data, show a message
  if (!modules.length || !dependencies.length) {
    return <div className="p-4 text-center">No module dependencies to display</div>;
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
