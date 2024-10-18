"use client";

import CreativeEditorSDK from "@cesdk/cesdk-js";
import { useEffect, useRef } from "react";

const config = {
  license: process.env.NEXT_PUBLIC_LICENSE,
  baseURL: "https://cdn.img.ly/packages/imgly/cesdk-js/1.37.0/assets",
  // Enable local uploads in Asset Library
  callbacks: { onUpload: "local" },
  theme: "dark",
  ui: {
    elements: {
      panels: {
        // inspector: {
        //   show: true, // true or false
        //   position: 'left', // 'left' or 'right'
        //   floating: false // true or false
        // },
        // assetLibrary: {
        //   show: true, // true or false
        //   position: 'left' // 'left' or 'right'
        // },
        settings: {
          show: true, // true or false
        },
      },
      // toolbar: true,

      navigation: {
        action: {
          // close: true,
          back: true,
          save: true,
          // download: true,
          // load: true,
          export: true,
        },
      },
    },
  },
};

export default function CreativeEditorSDKComponent() {
  const cesdk_container = useRef(null);
  // const [cesdk, setCesdk] = useState(null);
  useEffect(() => {
    if (!cesdk_container.current) return;

    let cleanedUp = false;
    let instance;
    CreativeEditorSDK.create(cesdk_container.current, config).then(
      async (_instance) => {
        instance = _instance;
        if (cleanedUp) {
          instance.dispose();
          return;
        }

        await Promise.all([
          instance.addDefaultAssetSources(),
          instance.addDemoAssetSources({ sceneMode: "Video" }),
        ]);
        await instance.createVideoScene();
        instance.ui.registerComponent(
          "document.dock",
          ({ builder: { Button }, engine }) => {
            const inspectorOpen = instance.ui.isPanelOpen(
              "//ly.img.panel/inspector"
            );

            Button("open-document", {
              label: "Aspect Ratio",
              // Using the open state to mark the button as selected
              isSelected: inspectorOpen,
              onClick: () => {
                // Deselect all blocks to enable the document inspector
                engine.block.findAllSelected().forEach((blockId) => {
                  engine.block.setSelected(blockId, false);
                });

                if (inspectorOpen) {
                  instance.ui.closePanel("//ly.img.panel/inspector");
                } else {
                  instance.ui.openPanel("//ly.img.panel/inspector");
                }
              },
            });
          }
        );
        instance.ui.setDockOrder([
          "document.dock",
          ...instance.ui.getDockOrder(),
        ]);
        // setCesdk(instance);
      }
    );
    const cleanup = () => {
      cleanedUp = true;
      instance?.dispose();
      // setCesdk(null);
    };
    return cleanup;
  }, [cesdk_container]);
  return (
    <div
      ref={cesdk_container}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
