
import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './dependency-graph.css';
import { useModules } from '@/hooks/useModules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// Définition du type pour les données du nœud
interface ModuleNodeData {
  label: string;
  status: 'active' | 'inactive' | 'degraded';
  isCore: boolean;
}

export const ModuleDependencyGraph = () => {
  const { dependencies, modules, loading, error } = useModules();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ModuleNodeData>[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  // Construire le graphe à partir des données des modules
  useEffect(() => {
    if (loading || modules.length === 0) return;

    // Créer les nœuds du graphe
    const graphNodes = modules.map((module, index) => ({
      id: module.id,
      type: 'default',
      position: calculateNodePosition(index, modules.length),
      data: {
        label: module.name,
        status: module.status,
        isCore: module.is_core
      },
      className: `module-node status-${module.status} ${module.is_core ? 'core-module' : ''}`,
    }));

    // Créer les arêtes (connexions) entre les nœuds
    const graphEdges: Edge[] = [];
    dependencies.forEach((dep) => {
      if (dep.dependency_id) {
        graphEdges.push({
          id: `${dep.module_id}-${dep.dependency_id}`,
          source: dep.module_id,
          target: dep.dependency_id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          animated: dep.is_required,
          style: { 
            stroke: dep.is_required ? '#ff4d4f' : '#8c8c8c',
            strokeWidth: dep.is_required ? 2 : 1,
          },
          label: dep.is_required ? 'Requise' : 'Optionnelle',
          labelStyle: { fill: dep.is_required ? '#ff4d4f' : '#8c8c8c', fontWeight: dep.is_required ? 'bold' : 'normal' },
        });
      }
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [modules, dependencies, loading, setNodes, setEdges]);

  // Calculer la position des nœuds en cercle
  const calculateNodePosition = (index: number, total: number) => {
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;
    return { x, y };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Graphe de Dépendances</CardTitle>
          <CardDescription>Chargement du graphe...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            Erreur
          </CardTitle>
          <CardDescription>
            Impossible de charger le graphe des dépendances: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphe de Dépendances</CardTitle>
        <CardDescription>Visualisez les relations entre les modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: '500px', width: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap zoomable pannable />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleDependencyGraph;
