import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { config, COMPONENT_META } from '../../lib/puckConfig';
import { useToast } from '../../components/Toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';

// ─── Override componentItem ───────────────────────────────────────────────────
function ComponentItemOverride({ children: _children, name }: { children: React.ReactNode; name: string }) {
  const meta = COMPONENT_META[name];
  if (!meta) return <>{_children}</>;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '6px',
        cursor: 'grab',
        userSelect: 'none',
        transition: 'background 0.15s',
      }}
      className="puck-component-item-custom"
    >
      <span
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          fontSize: 16,
          background: meta.color + '22',
          color: meta.color,
          fontWeight: 700,
          border: `1.5px solid ${meta.color}44`,
        }}
      >
        {meta.icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4, marginTop: 2 }}>
          {meta.description}
        </div>
      </div>
    </div>
  );
}

export default function PuckSectionsEditor() {
  const params = useParams<{ pageSlug?: string; parentSlug?: string; childSlug?: string; grandChildSlug?: string }>();
  // Reconstruit le slug complet pour gérer les slugs imbriqués
  // ex: /admin/pages/la-fabrique/amenagement/sections → "la-fabrique/amenagement"
  const targetSlug =
    [params.parentSlug, params.childSlug, params.grandChildSlug]
      .filter(Boolean)
      .join('/') || params.pageSlug || 'home';
  const [, setLocation] = useLocation();
  const toast = useToast();
  
  const [data, setData] = useState<any>(null);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [targetSlug]);

  const loadPage = async () => {
    try {
      const { api } = await import('../../lib/simple-api');
      // Recherche admin (supporte slugs avec slashes + drafts)
      const list: any = await api.get('/admin/pages?search=' + encodeURIComponent(targetSlug) + '&limit=100');
      const items: any[] = Array.isArray(list) ? list : (list?.data ?? []);
      const pageData = items.find((p: any) => p.slug === targetSlug);
      if (!pageData) {
        toast.show('Page introuvable: ' + targetSlug, 'error');
        return;
      }

      setPageId(pageData.id);
      
      const sections = pageData.sections || [];
      const puckData = {
        content: sections.map((section: any) => ({
          type: section.type,
          props: { ...section }
        })),
        root: { props: { title: pageData.title || '' } },
        zones: {}
      };
      
      setData(puckData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (puckData: any) => {
    try {
      const sections = puckData.content.map((item: any) => ({
        ...item.props,
        type: item.type
      }));
      
      if (!pageId) throw new Error("ID de page non trouvé");
      const { api } = await import('../../lib/simple-api');
      await api.put('/admin/pages/' + pageId, { sections });
      
      toast.show('Sections enregistrées avec succès', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  if(!data) return <div className='p-4'>Chargement de l\\'�diteur...</div>;

  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
       <div className='flex justify-between items-center mb-4'>
         <Button variant='outline' onClick={() => setLocation('/admin/pages')}>
           <ArrowLeft className='mr-2 h-4 w-4' /> Retour aux pages
         </Button>
         <h1 className='text-xl font-bold'>�diteur Visuel: {targetSlug}</h1>
       </div>
       <Puck
         config={config}
         data={data}
         onPublish={handleSave}
         iframe={{ enabled: false }}
         overrides={{ componentItem: ComponentItemOverride }}
       />
    </div>
  );
}
