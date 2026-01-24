import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from '../../hooks/useRouterParams';
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import { Button } from "../../components/Button";
import { ArrowLeft, Save, Eye } from "lucide-react";

export default function GrapesJSEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      const response = await fetch(`/api/grapes/pages/${pageId}`);
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  };

  useEffect(() => {
    if (!editorRef.current || editor || !pageData) return;

    const grapesEditor = grapesjs.init({
      container: editorRef.current,
      height: "100vh",
      width: "100%",
      storageManager: false,
      plugins: [gjsPresetWebpage, gjsBlocksBasic],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsBlocksBasic: {},
      },
      canvas: {
        styles: [],
        scripts: [],
      },
      blockManager: {
        appendTo: ".blocks-container",
      },
      styleManager: {
        appendTo: ".styles-container",
      },
      layerManager: {
        appendTo: ".layers-container",
      },
      traitManager: {
        appendTo: ".traits-container",
      },
      selectorManager: {
        appendTo: ".selectors-container",
      },
      panels: {
        defaults: [
          {
            id: "basic-actions",
            el: ".panel__basic-actions",
            buttons: [
              {
                id: "visibility",
                active: true,
                className: "btn-toggle-borders",
                label: '<i class="fa fa-clone"></i>',
                command: "sw-visibility",
              },
            ],
          },
          {
            id: "panel-devices",
            el: ".panel__devices",
            buttons: [
              {
                id: "device-desktop",
                label: '<i class="fa fa-desktop"></i>',
                command: "set-device-desktop",
                active: true,
                togglable: false,
              },
              {
                id: "device-tablet",
                label: '<i class="fa fa-tablet"></i>',
                command: "set-device-tablet",
                togglable: false,
              },
              {
                id: "device-mobile",
                label: '<i class="fa fa-mobile"></i>',
                command: "set-device-mobile",
                togglable: false,
              },
            ],
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "",
          },
          {
            name: "Tablet",
            width: "768px",
            widthMedia: "992px",
          },
          {
            name: "Mobile",
            width: "320px",
            widthMedia: "480px",
          },
        ],
      },
    });

    // Charger le contenu existant
    if (pageData.html) {
      grapesEditor.setComponents(pageData.html);
    }
    if (pageData.css) {
      grapesEditor.setStyle(pageData.css);
    }

    // Définir les commandes
    grapesEditor.Commands.add("set-device-desktop", {
      run: (editor) => editor.setDevice("Desktop"),
    });
    grapesEditor.Commands.add("set-device-tablet", {
      run: (editor) => editor.setDevice("Tablet"),
    });
    grapesEditor.Commands.add("set-device-mobile", {
      run: (editor) => editor.setDevice("Mobile"),
    });

    setEditor(grapesEditor);

    return () => {
      if (grapesEditor) {
        grapesEditor.destroy();
      }
    };
  }, [pageData]);

  const handleSave = async () => {
    if (!editor || !pageId) return;

    setIsSaving(true);
    try {
      const html = editor.getHtml();
      const css = editor.getCss();

      const response = await fetch(`/api/grapes/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          css,
        }),
      });

      if (response.ok) {
        alert("Page sauvegardée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (pageData?.path) {
      window.open(pageData.path, "_blank");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/visual-editor")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="font-semibold">{pageData?.name || "Chargement..."}</h2>
            <p className="text-sm text-gray-500">{pageData?.path}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={!pageData}
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!editor || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        {/* Panels */}
        <div className="panel__top">
          <div className="panel__basic-actions"></div>
          <div className="panel__devices"></div>
        </div>

        {/* Main Editor */}
        <div ref={editorRef} className="gjs-editor"></div>

        {/* Side Panels */}
        <div className="blocks-container"></div>
        <div className="styles-container"></div>
        <div className="layers-container"></div>
        <div className="traits-container"></div>
        <div className="selectors-container"></div>
      </div>

      <style>{`
        .gjs-editor {
          width: 100%;
          height: 100%;
        }
        .panel__top {
          padding: 0;
          width: 100%;
          display: flex;
          position: initial;
          justify-content: center;
          justify-content: space-between;
        }
        .panel__basic-actions {
          position: initial;
        }
        .panel__devices {
          position: initial;
        }
      `}</style>
    </div>
  );
}
