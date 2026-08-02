import { useState, useEffect, useContext, useRef } from "react";
import VrmViewer from "@/components/vrmViewer";
import { VrmStoreProvider } from "@/features/vrmStore/vrmStoreContext";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { PhysicalSize } from "@tauri-apps/api/dpi";
import { buildUrl } from "@/utils/buildUrl";
import { loadMixamoAnimation } from "@/lib/VRMAnimation/loadMixamoAnimation";
import { loadVRMAnimation } from "@/lib/VRMAnimation/loadVRMAnimation";

function PetInner() {
  const { viewer } = useContext(ViewerContext);
  const adjustedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // [代码开关] 在这里修改 true / false 控制是否启用消息气泡
  const ENABLE_CHAT_BUBBLE = true;
  // ==========================================

  // --- 状态管理 ---
  const [speechText, setSpeechText] = useState<string>("你好！按回车键(Enter)可以跟我聊天哦~");
  const [speechVisible, setSpeechVisible] = useState<boolean>(true);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const bubbleTimeoutRef = useRef<any>(null);

  // 控制气泡显示及自动隐藏
  const showSpeech = (text: string, duration = 5000) => {
    // 如果代码开关关闭了，直接不执行
    if (!ENABLE_CHAT_BUBBLE) return;

    setSpeechText(text);
    setSpeechVisible(true);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    if (duration > 0) {
      bubbleTimeoutRef.current = setTimeout(() => {
        setSpeechVisible(false);
      }, duration);
    }
  };

  useEffect(() => {
    viewer.configureForPet();

    // 透明化背景
    document.documentElement.style.backgroundColor = "transparent";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundImage = "none";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    const nextRoot = document.getElementById("root");
    if (nextRoot) {
      nextRoot.style.backgroundColor = "transparent";
    }

    // 禁用右键默认菜单（不影响 F12）
    const preventMenu = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventMenu);

    // 全局快捷键：按 Enter 唤出输入框
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLElement;
        // 如果当前没有在输入文字，则阻止默认并切换输入框显隐
        if (target.tagName !== "INPUT") {
          e.preventDefault();
          setInputVisible((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      document.removeEventListener("contextmenu", preventMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const unlisten = listen<{ url: string }>("vrm-changed", async (event) => {
      await viewer.loadVrm(buildUrl(event.payload.url), () => { });
      onModelReady();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [viewer]);

  useEffect(() => {
    const unlisten = listen<{ url: string }>("animation-changed", async (event) => {
      if (!viewer.model?.vrm) return;
      const url = event.payload.url;
      const animation = url.indexOf("vrma") > 0
        ? await loadVRMAnimation(url)
        : await loadMixamoAnimation(url, viewer.model.vrm);
      if (animation) {
        viewer.model.loadAnimation(animation);
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [viewer]);

  useEffect(() => {
    const unlisten = listen<{ enabled: boolean }>("procedural-animation-changed", async (event) => {
      if (!viewer.model?.vrm) return;
      if (event.payload.enabled) {
        viewer.model.vrm.humanoid.resetNormalizedPose();
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [viewer]);

  useEffect(() => {
    if (!adjustedRef.current) {
      adjustedRef.current = true;
      const checkReady = setInterval(() => {
        if (viewer.model) {
          clearInterval(checkReady);
          onModelReady();
        }
      }, 500);
      return () => clearInterval(checkReady);
    }
  }, [viewer]);

  // [修复拖拽] 采用轮询机制精准将拖拽事件只绑定给底层 3D Canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    const tryBindDrag = () => {
      const canvas = container.querySelector("canvas");
      if (canvas) {
        const onPointerDown = (e: PointerEvent) => {
          if (e.button === 0) { // 限制为鼠标左键触发拖拽
            getCurrentWindow().startDragging();
          }
        };
        canvas.addEventListener("pointerdown", onPointerDown);
        (container as any).__petCleanup = () => {
          canvas.removeEventListener("pointerdown", onPointerDown);
        };
      } else {
        rafId = requestAnimationFrame(tryBindDrag);
      }
    };
    rafId = requestAnimationFrame(tryBindDrag);

    return () => {
      cancelAnimationFrame(rafId);
      const cleanup = (container as any).__petCleanup;
      if (cleanup) cleanup();
    };
  }, []);

  const onModelReady = () => {
    viewer.adjustForPet();

    // 动态计算更新窗口大小，Padding 设为 120 确保侧边有足够空间放气泡
    const updateWindowSize = () => {
      const size = viewer.getPetWindowSize(120);
      if (size) {
        getCurrentWindow().setSize(new PhysicalSize(size.width, size.height));
      }
    };

    requestAnimationFrame(() => updateWindowSize());

    // 监听滚轮缩放，防抖同步更新窗口大小
    if (viewer.cameraControls) {
      let resizeTimeout: any;
      const onCameraChange = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateWindowSize();
        }, 150);
      };

      viewer.cameraControls.removeEventListener("change", (window as any)._petCameraChangeListener);
      (window as any)._petCameraChangeListener = onCameraChange;
      viewer.cameraControls.addEventListener("change", onCameraChange);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      showSpeech(inputText);
    }
    setInputText("");
    setInputVisible(false);
  };

  return (
    <>
      <style>{`
        html, body, #root {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          outline: none !important;
          overflow: hidden !important;
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ position: "relative", width: "100vw", height: "100vh" }}
      >

        {/* 3D角色展示区 (满铺画布) */}
        <VrmViewer chatMode={false} />

        {/*
          [侧边气泡] 判断代码开关 ENABLE_CHAT_BUBBLE 是否开启
        */}
        {ENABLE_CHAT_BUBBLE && (
          <div style={{
            position: "absolute",
            top: "25%",
            right: "5%",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            padding: "2vw 3vw",
            borderRadius: "2.5vw",
            boxShadow: "0 1vw 2vw rgba(0,0,0,0.15)",
            maxWidth: "35vw",
            wordWrap: "break-word",
            zIndex: 10,
            pointerEvents: "none",
            color: "#333",
            fontSize: "3.5vw",
            fontWeight: "bold",
            opacity: speechVisible ? 1 : 0,
            transform: speechVisible ? "scale(1)" : "scale(0.8)",
            transformOrigin: "left center",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
            {speechText}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "-1.5vw",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "1.2vw solid transparent",
              borderBottom: "1.2vw solid transparent",
              borderRight: "1.5vw solid rgba(255, 255, 255, 0.92)"
            }} />
          </div>
        )}

        {/*
          [简洁的输入框] 只需按 Enter 呼出/发送
        */}
        {inputVisible && (
          <form
            onSubmit={handleChatSubmit}
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70vw",
              zIndex: 20
            }}
          >
            <input
              type="text"
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="说点什么... (按回车发送)"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "1.5vw 2.5vw",
                borderRadius: "3vw",
                border: "none",
                outline: "none",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 1vw 2vw rgba(0,0,0,0.2)",
                fontSize: "3vw",
                color: "#333"
              }}
            />
          </form>
        )}
      </div>
    </>
  );
}

export default function PetPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  if (!showContent) return null;

  return (
    <VrmStoreProvider>
      <PetInner />
    </VrmStoreProvider>
  );
}
