"use client";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Brush,
  Camera,
  Check,
  Circle,
  Download,
  Eraser,
  Eye,
  EyeOff,
  ImagePlus,
  Move,
  Redo2,
  RefreshCcw,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react";
import { motion } from "framer-motion";

type SelectionMode = "circle" | "brush";
type BrushMode = "paint" | "erase";

type TextureType = "smooth" | "matte" | "metallic" | "diamond";

type Finish = {
  id: string;
  name: string;
  color: string;
  preview: string;
  blendMode: GlobalCompositeOperation;
  saturation: number;
  brightness: number;
  contrast: number;
  metallic: number;
  gloss: number;
  texture: TextureType;
};

const finishes: Finish[] = [
  {
    id: "noir-brillant",
    name: "Noir brillant",
    color: "#090909",
    preview: "linear-gradient(135deg, #030303, #2d2d2d, #050505)",
    blendMode: "color",
    saturation: 0.15,
    brightness: 0.72,
    contrast: 1.2,
    metallic: 25,
    gloss: 90,
    texture: "smooth",
  },
  {
    id: "noir-mat",
    name: "Noir mat",
    color: "#151515",
    preview: "linear-gradient(135deg, #0e0e0e, #242424, #111111)",
    blendMode: "multiply",
    saturation: 0.1,
    brightness: 0.76,
    contrast: 1.05,
    metallic: 5,
    gloss: 10,
    texture: "matte",
  },
  {
    id: "anthracite",
    name: "Anthracite",
    color: "#484b4e",
    preview: "linear-gradient(135deg, #25282a, #707479, #303336)",
    blendMode: "color",
    saturation: 0.25,
    brightness: 0.9,
    contrast: 1.12,
    metallic: 65,
    gloss: 55,
    texture: "metallic",
  },
  {
    id: "bronze",
    name: "Bronze",
    color: "#805326",
    preview: "linear-gradient(135deg, #3d2510, #b77b3e, #59401f)",
    blendMode: "color",
    saturation: 0.85,
    brightness: 0.94,
    contrast: 1.12,
    metallic: 70,
    gloss: 50,
    texture: "metallic",
  },
  {
    id: "dore",
    name: "Doré",
    color: "#c29a3a",
    preview: "linear-gradient(135deg, #6e5114, #ebc766, #92701c)",
    blendMode: "color",
    saturation: 1,
    brightness: 1,
    contrast: 1.14,
    metallic: 80,
    gloss: 65,
    texture: "metallic",
  },
  {
    id: "chrome",
    name: "Chromé",
    color: "#d9dde2",
    preview:
      "linear-gradient(135deg, #353535, #f7f7f7, #707070, #eeeeee, #454545)",
    blendMode: "color",
    saturation: 0,
    brightness: 1.12,
    contrast: 1.38,
    metallic: 100,
    gloss: 100,
    texture: "metallic",
  },
  {
    id: "diamond-cut",
    name: "Diamond Cut",
    color: "#bec4ca",
    preview:
      "linear-gradient(135deg, #202020, #dfe4e8, #60656a, #f3f3f3, #282828)",
    blendMode: "color",
    saturation: 0.05,
    brightness: 1.08,
    contrast: 1.34,
    metallic: 95,
    gloss: 85,
    texture: "diamond",
  },
];

const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 900;
const MAX_UNDO_STEPS = 20;

export default function WheelVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] =
    useState<SelectionMode>("circle");

  const [brushMode, setBrushMode] = useState<BrushMode>("paint");
  const [brushSize, setBrushSize] = useState(45);
  const [showMask, setShowMask] = useState(true);

  const [selectedFinish, setSelectedFinish] = useState<Finish>(finishes[0]);

  const [wheelX, setWheelX] = useState(300);
  const [wheelY, setWheelY] = useState(300);
  const [wheelRadius, setWheelRadius] = useState(120);

  const [intensity, setIntensity] = useState(75);
  const [gloss, setGloss] = useState(finishes[0].gloss);
  const [metallic, setMetallic] = useState(finishes[0].metallic);
  const [contrast, setContrast] = useState(
    Math.round(finishes[0].contrast * 100)
  );

  const [showEffect, setShowEffect] = useState(true);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);

  function createMaskCanvas(width: number, height: number) {
    const maskCanvas = document.createElement("canvas");

    maskCanvas.width = width;
    maskCanvas.height = height;

    maskCanvasRef.current = maskCanvas;
    undoStackRef.current = [];
    redoStackRef.current = [];

    setUndoCount(0);
    setRedoCount(0);
  }

  function getCanvasCoordinates(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function getMaskImageData() {
    const maskCanvas = maskCanvasRef.current;
    const context = maskCanvas?.getContext("2d");

    if (!maskCanvas || !context) return null;

    return context.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );
  }

  function restoreMaskImageData(imageData: ImageData) {
    const maskCanvas = maskCanvasRef.current;
    const context = maskCanvas?.getContext("2d");

    if (!maskCanvas || !context) return;

    context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    context.putImageData(imageData, 0, 0);
  }

  function saveUndoState() {
    const imageData = getMaskImageData();

    if (!imageData) return;

    undoStackRef.current.push(imageData);

    if (undoStackRef.current.length > MAX_UNDO_STEPS) {
      undoStackRef.current.shift();
    }

    redoStackRef.current = [];

    setUndoCount(undoStackRef.current.length);
    setRedoCount(0);
  }

  const renderCanvas = useCallback(
    (showEditorGuides = true) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;

      if (!canvas || !image) return;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.filter = "none";
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.restore();

      if (showEffect) {
        const effectCanvas = document.createElement("canvas");
        effectCanvas.width = canvas.width;
        effectCanvas.height = canvas.height;

        const effectContext = effectCanvas.getContext("2d");

        if (!effectContext) return;

        effectContext.clearRect(
          0,
          0,
          effectCanvas.width,
          effectCanvas.height
        );

        effectContext.filter = `
          saturate(${selectedFinish.saturation})
          brightness(${selectedFinish.brightness})
          contrast(${contrast / 100})
        `;

        effectContext.drawImage(
          image,
          0,
          0,
          effectCanvas.width,
          effectCanvas.height
        );

        effectContext.filter = "none";
        effectContext.globalCompositeOperation =
          selectedFinish.blendMode;
        effectContext.globalAlpha = intensity / 100;
        effectContext.fillStyle = selectedFinish.color;

        effectContext.fillRect(
          0,
          0,
          effectCanvas.width,
          effectCanvas.height
        );

        effectContext.globalAlpha = 1;
        effectContext.globalCompositeOperation = "screen";

        const glossOpacity = (gloss / 100) * 0.5;
        const metallicOpacity = (metallic / 100) * 0.35;

        const shineGradient = effectContext.createLinearGradient(
          0,
          0,
          effectCanvas.width,
          effectCanvas.height
        );

        shineGradient.addColorStop(0, "rgba(255,255,255,0)");
        shineGradient.addColorStop(
          0.38,
          `rgba(255,255,255,${glossOpacity * 0.2})`
        );
        shineGradient.addColorStop(
          0.48,
          `rgba(255,255,255,${glossOpacity})`
        );
        shineGradient.addColorStop(
          0.57,
          `rgba(255,255,255,${glossOpacity * 0.15})`
        );
        shineGradient.addColorStop(1, "rgba(255,255,255,0)");

        effectContext.fillStyle = shineGradient;
        effectContext.fillRect(
          0,
          0,
          effectCanvas.width,
          effectCanvas.height
        );

        if (
          selectedFinish.texture === "metallic" ||
          selectedFinish.texture === "diamond"
        ) {
          effectContext.globalCompositeOperation = "overlay";

          const spacing =
            selectedFinish.texture === "diamond" ? 7 : 12;

          effectContext.strokeStyle = `rgba(255,255,255,${metallicOpacity})`;
          effectContext.lineWidth =
            selectedFinish.texture === "diamond" ? 1.2 : 0.7;

          for (
            let position = -effectCanvas.height;
            position < effectCanvas.width;
            position += spacing
          ) {
            effectContext.beginPath();
            effectContext.moveTo(position, 0);
            effectContext.lineTo(
              position + effectCanvas.height,
              effectCanvas.height
            );
            effectContext.stroke();
          }
        }

        if (selectedFinish.texture === "matte") {
          effectContext.globalCompositeOperation = "multiply";
          effectContext.fillStyle = "rgba(20,20,20,0.15)";
          effectContext.fillRect(
            0,
            0,
            effectCanvas.width,
            effectCanvas.height
          );
        }

        const activeMaskCanvas = document.createElement("canvas");

        activeMaskCanvas.width = canvas.width;
        activeMaskCanvas.height = canvas.height;

        const activeMaskContext =
          activeMaskCanvas.getContext("2d");

        if (!activeMaskContext) return;

        activeMaskContext.clearRect(
          0,
          0,
          activeMaskCanvas.width,
          activeMaskCanvas.height
        );

        if (selectionMode === "circle") {
          activeMaskContext.beginPath();
          activeMaskContext.arc(
            wheelX,
            wheelY,
            wheelRadius,
            0,
            Math.PI * 2
          );
          activeMaskContext.fillStyle = "#ffffff";
          activeMaskContext.fill();
        } else if (maskCanvasRef.current) {
          activeMaskContext.drawImage(maskCanvasRef.current, 0, 0);
        }

        effectContext.globalAlpha = 1;
        effectContext.globalCompositeOperation = "destination-in";
        effectContext.drawImage(activeMaskCanvas, 0, 0);

        context.save();
        context.globalCompositeOperation = "source-over";
        context.drawImage(effectCanvas, 0, 0);
        context.restore();
      }

      if (!showEditorGuides) return;

      if (selectionMode === "circle") {
        context.save();

        context.beginPath();
        context.arc(
          wheelX,
          wheelY,
          wheelRadius,
          0,
          Math.PI * 2
        );

        context.strokeStyle = "#d4af37";
        context.lineWidth = 3;
        context.setLineDash([10, 8]);
        context.stroke();

        context.beginPath();
        context.arc(wheelX, wheelY, 6, 0, Math.PI * 2);
        context.fillStyle = "#d4af37";
        context.fill();

        context.restore();
      }

      if (
        selectionMode === "brush" &&
        showMask &&
        maskCanvasRef.current
      ) {
        const previewCanvas = document.createElement("canvas");
        previewCanvas.width = canvas.width;
        previewCanvas.height = canvas.height;

        const previewContext = previewCanvas.getContext("2d");

        if (!previewContext) return;

        previewContext.drawImage(maskCanvasRef.current, 0, 0);

        previewContext.globalCompositeOperation = "source-in";
        previewContext.fillStyle = "rgba(212,175,55,0.35)";
        previewContext.fillRect(
          0,
          0,
          previewCanvas.width,
          previewCanvas.height
        );

        context.drawImage(previewCanvas, 0, 0);
      }
    },
    [
      contrast,
      gloss,
      intensity,
      metallic,
      selectedFinish,
      selectionMode,
      showEffect,
      showMask,
      wheelRadius,
      wheelX,
      wheelY,
    ]
  );

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, imageUrl]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      alert("L’image doit faire moins de 12 Mo.");
      return;
    }

    const nextImageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        URL.revokeObjectURL(nextImageUrl);
        return;
      }

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const scale = Math.min(
        MAX_IMAGE_WIDTH / image.width,
        MAX_IMAGE_HEIGHT / image.height,
        1
      );

      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      imageRef.current = image;

      createMaskCanvas(canvas.width, canvas.height);

      const initialRadius =
        Math.min(canvas.width, canvas.height) * 0.2;

      setImageUrl(nextImageUrl);
      setWheelX(canvas.width / 2);
      setWheelY(canvas.height / 2);
      setWheelRadius(initialRadius);
      setSelectionMode("circle");
      setShowEffect(true);
    };

    image.onerror = () => {
      URL.revokeObjectURL(nextImageUrl);
      alert("Impossible de charger cette image.");
    };

    image.src = nextImageUrl;

    event.target.value = "";
  }

  function drawBrushLine(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const maskCanvas = maskCanvasRef.current;
    const context = maskCanvas?.getContext("2d");

    if (!maskCanvas || !context) return;

    context.save();

    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";

    if (brushMode === "erase") {
      context.globalCompositeOperation = "destination-out";
      context.strokeStyle = "rgba(0,0,0,1)";
    } else {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = "rgba(255,255,255,1)";
    }

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();

    context.restore();
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    if (!imageUrl) return;

    const position = getCanvasCoordinates(event);

    setIsPointerDown(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (selectionMode === "circle") {
      const distance = Math.hypot(
        position.x - wheelX,
        position.y - wheelY
      );

      if (distance > wheelRadius) {
        setWheelX(position.x);
        setWheelY(position.y);
      }

      return;
    }

    saveUndoState();

    lastPointRef.current = position;
    drawBrushLine(position, position);
    renderCanvas();
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    if (!isPointerDown) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const position = getCanvasCoordinates(event);

    if (selectionMode === "circle") {
      setWheelX(
        Math.max(
          wheelRadius,
          Math.min(canvas.width - wheelRadius, position.x)
        )
      );

      setWheelY(
        Math.max(
          wheelRadius,
          Math.min(canvas.height - wheelRadius, position.y)
        )
      );

      return;
    }

    const previousPoint = lastPointRef.current ?? position;

    drawBrushLine(previousPoint, position);
    lastPointRef.current = position;

    renderCanvas();
  }

  function handlePointerUp(
    event: ReactPointerEvent<HTMLCanvasElement>
  ) {
    setIsPointerDown(false);
    lastPointRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    renderCanvas();
  }

  function undoMask() {
    const previousState = undoStackRef.current.pop();
    const currentState = getMaskImageData();

    if (!previousState || !currentState) return;

    redoStackRef.current.push(currentState);
    restoreMaskImageData(previousState);

    setUndoCount(undoStackRef.current.length);
    setRedoCount(redoStackRef.current.length);

    renderCanvas();
  }

  function redoMask() {
    const nextState = redoStackRef.current.pop();
    const currentState = getMaskImageData();

    if (!nextState || !currentState) return;

    undoStackRef.current.push(currentState);
    restoreMaskImageData(nextState);

    setUndoCount(undoStackRef.current.length);
    setRedoCount(redoStackRef.current.length);

    renderCanvas();
  }

  function clearMask() {
    const maskCanvas = maskCanvasRef.current;
    const context = maskCanvas?.getContext("2d");

    if (!maskCanvas || !context) return;

    saveUndoState();

    context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    renderCanvas();
  }

  function applyFinish(finish: Finish) {
    setSelectedFinish(finish);
    setGloss(finish.gloss);
    setMetallic(finish.metallic);
    setContrast(Math.round(finish.contrast * 100));
    setShowEffect(true);
  }

  function resetVisualizer() {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const maskContext = maskCanvas?.getContext("2d");

    if (!canvas) return;

    if (maskCanvas && maskContext) {
      maskContext.clearRect(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      );
    }

    undoStackRef.current = [];
    redoStackRef.current = [];

    setUndoCount(0);
    setRedoCount(0);

    setSelectionMode("circle");
    setBrushMode("paint");
    setBrushSize(45);
    setShowMask(true);

    setWheelX(canvas.width / 2);
    setWheelY(canvas.height / 2);
    setWheelRadius(Math.min(canvas.width, canvas.height) * 0.2);

    setIntensity(75);
    applyFinish(finishes[0]);
  }

  function downloadSimulation() {
    const canvas = canvasRef.current;

    if (!canvas || !imageUrl) return;

    renderCanvas(false);

    requestAnimationFrame(() => {
      const link = document.createElement("a");

      link.download = `simulation-jante-${selectedFinish.id}.png`;
      link.href = canvas.toDataURL("image/png", 0.95);
      link.click();

      renderCanvas(true);
    });
  }

  return (
    <section
      id="visualiseur"
      className="relative overflow-hidden bg-[#050505] py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#d4af37]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.32em] text-[#d4af37]">
            <Sparkles size={15} />
            Simulateur interactif
          </span>

          <h2 className="mt-5 text-4xl font-black uppercase leading-none text-white sm:text-5xl lg:text-6xl">
            Visualisez vos futures{" "}
            <span className="text-[#d4af37]">jantes</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55">
            Importez une photo, sélectionnez précisément votre jante et
            testez différentes couleurs et finitions.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-white/65">
                {selectionMode === "circle" ? (
                  <Move size={17} className="text-[#d4af37]" />
                ) : (
                  <Brush size={17} className="text-[#d4af37]" />
                )}

                {selectionMode === "circle"
                  ? "Déplacez le cercle sur la jante"
                  : "Peignez uniquement la surface de la jante"}
              </div>

              {imageUrl && (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                  <Check size={14} />
                  Photo importée
                </span>
              )}
            </div>

            {imageUrl && (
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => setSelectionMode("circle")}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                    selectionMode === "circle"
                      ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                      : "border-white/10 text-white/55 hover:text-white"
                  }`}
                >
                  <Circle size={16} />
                  Cercle
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionMode("brush")}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                    selectionMode === "brush"
                      ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                      : "border-white/10 text-white/55 hover:text-white"
                  }`}
                >
                  <Brush size={16} />
                  Pinceau
                </button>

                {selectionMode === "brush" && (
                  <>
                    <div className="mx-1 hidden h-7 w-px bg-white/10 sm:block" />

                    <button
                      type="button"
                      onClick={() => setBrushMode("paint")}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        brushMode === "paint"
                          ? "border-[#d4af37] text-[#d4af37]"
                          : "border-white/10 text-white/55"
                      }`}
                    >
                      <Brush size={15} />
                      Peindre
                    </button>

                    <button
                      type="button"
                      onClick={() => setBrushMode("erase")}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        brushMode === "erase"
                          ? "border-[#d4af37] text-[#d4af37]"
                          : "border-white/10 text-white/55"
                      }`}
                    >
                      <Eraser size={15} />
                      Effacer
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="relative flex min-h-[440px] items-center justify-center bg-black p-3 sm:p-6">
              {!imageUrl && (
                <label className="flex min-h-[380px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 text-center transition hover:border-[#d4af37]/60 hover:bg-[#d4af37]/[0.03]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
                    <ImagePlus size={27} />
                  </span>

                  <span className="mt-5 text-lg font-bold text-white">
                    Choisir une photo
                  </span>

                  <span className="mt-2 max-w-sm text-sm leading-6 text-white/45">
                    Utilisez une photo proche, bien éclairée et avec la
                    jante entièrement visible.
                  </span>

                  <span className="mt-5 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-black uppercase tracking-wide text-black">
                    Importer une image
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              )}

              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`max-h-[680px] w-full touch-none rounded-lg object-contain ${
                  imageUrl
                    ? selectionMode === "brush"
                      ? "block cursor-crosshair"
                      : "block cursor-move"
                    : "hidden"
                }`}
              />
            </div>

            {imageUrl && selectionMode === "brush" && (
              <div className="border-t border-white/10 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={undoCount === 0}
                    onClick={undoMask}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:border-[#d4af37]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Undo2 size={16} />
                    Annuler
                  </button>

                  <button
                    type="button"
                    disabled={redoCount === 0}
                    onClick={redoMask}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:border-[#d4af37]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Redo2 size={16} />
                    Rétablir
                  </button>

                  <button
                    type="button"
                    onClick={clearMask}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:border-red-400/50 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                    Effacer la sélection
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMask((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:border-[#d4af37]/50 hover:text-white"
                  >
                    {showMask ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showMask
                      ? "Masquer la sélection"
                      : "Afficher la sélection"}
                  </button>
                </div>

                <label className="mt-4 block">
                  <span className="flex items-center justify-between text-sm font-semibold text-white/65">
                    Taille du pinceau
                    <span className="text-[#d4af37]">
                      {brushSize} px
                    </span>
                  </span>

                  <input
                    type="range"
                    min="10"
                    max="160"
                    value={brushSize}
                    onChange={(event) =>
                      setBrushSize(Number(event.target.value))
                    }
                    className="mt-3 w-full accent-[#d4af37]"
                  />
                </label>
              </div>
            )}

            {imageUrl && (
              <div className="flex flex-wrap gap-3 border-t border-white/10 p-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-[#d4af37]/50 hover:text-white">
                  <Camera size={17} />
                  Changer la photo

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowEffect((current) => !current)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-[#d4af37]/50 hover:text-white"
                >
                  {showEffect
                    ? "Voir la photo originale"
                    : "Voir la simulation"}
                </button>

                <button
                  type="button"
                  onClick={resetVisualizer}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-[#d4af37]/50 hover:text-white"
                >
                  <RefreshCcw size={16} />
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-6">
            <h3 className="text-lg font-black uppercase text-white">
              Choisissez la finition
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {finishes.map((finish) => {
                const active =
                  selectedFinish.id === finish.id;

                return (
                  <motion.button
                    key={finish.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => applyFinish(finish)}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[#d4af37] bg-[#d4af37]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <span
                      className="block h-10 w-full rounded-lg border border-white/10"
                      style={{ background: finish.preview }}
                    />

                    <span
                      className={`mt-3 block text-sm font-bold ${
                        active
                          ? "text-[#d4af37]"
                          : "text-white/65"
                      }`}
                    >
                      {finish.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-7 space-y-6">
              {selectionMode === "circle" && (
                <label className="block">
                  <span className="flex items-center justify-between text-sm font-semibold text-white/70">
                    Taille de la zone
                    <span className="text-[#d4af37]">
                      {Math.round(wheelRadius)} px
                    </span>
                  </span>

                  <input
                    type="range"
                    min="40"
                    max="350"
                    value={wheelRadius}
                    onChange={(event) =>
                      setWheelRadius(Number(event.target.value))
                    }
                    className="mt-3 w-full accent-[#d4af37]"
                  />
                </label>
              )}

              <label className="block">
                <span className="flex items-center justify-between text-sm font-semibold text-white/70">
                  Intensité
                  <span className="text-[#d4af37]">
                    {intensity} %
                  </span>
                </span>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={(event) =>
                    setIntensity(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-[#d4af37]"
                />
              </label>

              <label className="block">
                <span className="flex items-center justify-between text-sm font-semibold text-white/70">
                  Brillance
                  <span className="text-[#d4af37]">{gloss} %</span>
                </span>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gloss}
                  onChange={(event) =>
                    setGloss(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-[#d4af37]"
                />
              </label>

              <label className="block">
                <span className="flex items-center justify-between text-sm font-semibold text-white/70">
                  Effet métallique
                  <span className="text-[#d4af37]">
                    {metallic} %
                  </span>
                </span>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={metallic}
                  onChange={(event) =>
                    setMetallic(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-[#d4af37]"
                />
              </label>

              <label className="block">
                <span className="flex items-center justify-between text-sm font-semibold text-white/70">
                  Contraste
                  <span className="text-[#d4af37]">
                    {contrast} %
                  </span>
                </span>

                <input
                  type="range"
                  min="70"
                  max="160"
                  value={contrast}
                  onChange={(event) =>
                    setContrast(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-[#d4af37]"
                />
              </label>
            </div>

            <button
              type="button"
              disabled={!imageUrl}
              onClick={downloadSimulation}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-[#e2bf4b] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Download size={18} />
              Télécharger la simulation
            </button>

            <a
              href="#contact"
              className={`mt-3 inline-flex w-full items-center justify-center rounded-xl border px-5 py-4 text-sm font-black uppercase tracking-wide transition ${
                imageUrl
                  ? "border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                  : "pointer-events-none border-white/10 text-white/25"
              }`}
            >
              Demander cette finition
            </a>

            <p className="mt-5 text-xs leading-5 text-white/35">
              Simulation fournie à titre indicatif. Le résultat réel
              peut varier selon l’état, le matériau, l’éclairage et la
              finition de la jante.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}