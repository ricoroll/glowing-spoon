import { useCallback, useEffect, useRef } from 'react';

import { LERP_SPEED, MAX_BLOCKS } from './constants';
import {
  blocksFragmentShader, blocksVertexShader,
  shadowFragmentShader, shadowVertexShader,
  skyFragmentShader,    skyVertexShader,
} from './shaders';
import type { BlockData } from './types';
import { generateBlockData, generateQRMatrix } from './utils';

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface UseWebGPUOptions {
  canvasRef:    React.RefObject<HTMLCanvasElement | null>;
  canvasWidth:  number;
  canvasHeight: number;
  qrContent:    string;
  isFlat:       React.RefObject<boolean>;
}

export function useWebGPU({
  canvasRef,
  canvasWidth,
  canvasHeight,
  qrContent,
  isFlat,
}: UseWebGPUOptions) {
  const animationRef     = useRef<number | null>(null);
  const startTimeRef     = useRef<number>(Date.now());
  const rawProgressRef   = useRef(0);
  const progressRef      = useRef(0);
  const lastFrameTimeRef = useRef<number>(Date.now());

  const deviceRef      = useRef<GPUDevice | null>(null);
  const typeBufferRef  = useRef<GPUBuffer | null>(null);
  const posBufferRef   = useRef<GPUBuffer | null>(null);
  const heightBufferRef = useRef<GPUBuffer | null>(null);
  const baseYBufferRef  = useRef<GPUBuffer | null>(null);
  const blockDataRef    = useRef<{ numBlocks: number; gridSize: number }>({
    numBlocks: 0,
    gridSize:  0,
  });
  const qrContentRef = useRef(qrContent);
  qrContentRef.current = qrContent;

  // Update GPU buffers when QR content changes
  useEffect(() => {
    const device      = deviceRef.current;
    const typeBuffer  = typeBufferRef.current;
    const posBuffer   = posBufferRef.current;
    const heightBuffer = heightBufferRef.current;
    const baseYBuffer  = baseYBufferRef.current;
    if (!device || !typeBuffer || !posBuffer || !heightBuffer || !baseYBuffer) return;

    const qrMatrix  = generateQRMatrix(qrContent);
    const blockData = generateBlockData(qrMatrix);
    uploadBuffers(device, blockData, { typeBuffer, posBuffer, heightBuffer, baseYBuffer });
    blockDataRef.current = { numBlocks: blockData.numBlocks, gridSize: blockData.gridSize };
  }, [qrContent]);

  const initWebGPU = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!navigator.gpu) {
      console.warn('WebGPU not supported in this browser.');
      return;
    }

    const context = canvas.getContext('webgpu') as GPUCanvasContext | null;
    if (!context) return;

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return;

    const device = await adapter.requestDevice();
    deviceRef.current = device;

    const format = navigator.gpu.getPreferredCanvasFormat();
    const dpr    = window.devicePixelRatio ?? 1;
    canvas.width  = canvasWidth  * dpr;
    canvas.height = canvasHeight * dpr;

    context.configure({ device, format, alphaMode: 'premultiplied' });

    // Build initial block data
    const qrMatrix  = generateQRMatrix(qrContentRef.current);
    const blockData = generateBlockData(qrMatrix);
    blockDataRef.current = { numBlocks: blockData.numBlocks, gridSize: blockData.gridSize };

    // Uniform buffer (8 × f32 = 32 bytes)
    const uniformBuffer = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Instance storage buffers
    const typeBuffer = device.createBuffer({
      size: MAX_BLOCKS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    typeBufferRef.current = typeBuffer;

    const posBuffer = device.createBuffer({
      size: MAX_BLOCKS * 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    posBufferRef.current = posBuffer;

    const heightBuffer = device.createBuffer({
      size: MAX_BLOCKS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    heightBufferRef.current = heightBuffer;

    const baseYBuffer = device.createBuffer({
      size: MAX_BLOCKS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    baseYBufferRef.current = baseYBuffer;

    uploadBuffers(device, blockData, { typeBuffer, posBuffer, heightBuffer, baseYBuffer });

    // ── Bind group layouts ──────────────────────────────────────────────────
    const blocksBGL = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 3, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 4, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });

    const skyBGL = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const blocksBindGroup = device.createBindGroup({
      layout: blocksBGL,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: { buffer: typeBuffer } },
        { binding: 2, resource: { buffer: posBuffer } },
        { binding: 3, resource: { buffer: heightBuffer } },
        { binding: 4, resource: { buffer: baseYBuffer } },
      ],
    });

    const skyBindGroup = device.createBindGroup({
      layout: skyBGL,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    // ── Pipelines ───────────────────────────────────────────────────────────
    const skyPipeline = makePipeline(device, format, skyBGL, {
      vertex: skyVertexShader, fragment: skyFragmentShader,
      depthWrite: false, depthCompare: 'always',
    });

    const shadowPipeline = makePipeline(device, format, skyBGL, {
      vertex: shadowVertexShader, fragment: shadowFragmentShader,
      depthWrite: false, depthCompare: 'always',
      blend: {
        color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
        alpha: { srcFactor: 'one',       dstFactor: 'one-minus-src-alpha', operation: 'add' },
      },
    });

    const blocksPipeline = makePipeline(device, format, blocksBGL, {
      vertex: blocksVertexShader, fragment: blocksFragmentShader,
      depthWrite: true, depthCompare: 'less',
    });

    const depthTexture = device.createTexture({
      size:   [canvas.width, canvas.height],
      format: 'depth24plus',
      usage:  GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const aspectRatio = canvas.width / canvas.height;

    // ── Render loop ─────────────────────────────────────────────────────────
    const render = () => {
      const now = Date.now();
      const dt  = Math.min((now - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = now;

      const target = isFlat.current ? 1 : 0;
      rawProgressRef.current += (target - rawProgressRef.current) * Math.min(1, LERP_SPEED * dt);
      if (Math.abs(rawProgressRef.current - target) < 0.001) rawProgressRef.current = target;
      progressRef.current = easeInOutCubic(rawProgressRef.current);

      const time = (now - startTimeRef.current) / 1000;
      const { numBlocks, gridSize } = blockDataRef.current;

      device.queue.writeBuffer(
        uniformBuffer, 0,
        new Float32Array([aspectRatio, time, numBlocks, progressRef.current, gridSize, 0, 0, 0]),
      );

      const commandEncoder = device.createCommandEncoder();
      const textureView    = context.getCurrentTexture().createView();

      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view:       textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp:     'clear',
          storeOp:    'store',
        }],
        depthStencilAttachment: {
          view:           depthTexture.createView(),
          depthClearValue: 1,
          depthLoadOp:    'clear',
          depthStoreOp:   'store',
        },
      });

      renderPass.setPipeline(skyPipeline);
      renderPass.setBindGroup(0, skyBindGroup);
      renderPass.draw(3);

      renderPass.setPipeline(shadowPipeline);
      renderPass.setBindGroup(0, skyBindGroup);
      renderPass.draw(6);

      renderPass.setPipeline(blocksPipeline);
      renderPass.setBindGroup(0, blocksBindGroup);
      renderPass.draw(36 * numBlocks);

      renderPass.end();
      device.queue.submit([commandEncoder.finish()]);
      // Note: browser WebGPU auto-presents — no context.present() needed

      animationRef.current = requestAnimationFrame(render);
    };

    render();
  }, [canvasWidth, canvasHeight, canvasRef, isFlat]);

  useEffect(() => {
    const id = setTimeout(initWebGPU, 100);
    return () => {
      clearTimeout(id);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initWebGPU]);
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function uploadBuffers(
  device: GPUDevice,
  blockData: BlockData,
  buffers: { typeBuffer: GPUBuffer; posBuffer: GPUBuffer; heightBuffer: GPUBuffer; baseYBuffer: GPUBuffer },
) {
  const { types, positions, heights, baseY } = blockData;

  const paddedTypes = new Uint32Array(MAX_BLOCKS);
  paddedTypes.set(types);
  device.queue.writeBuffer(buffers.typeBuffer, 0, paddedTypes);

  const paddedPositions = new Float32Array(MAX_BLOCKS * 4);
  paddedPositions.set(positions);
  device.queue.writeBuffer(buffers.posBuffer, 0, paddedPositions);

  const paddedHeights = new Float32Array(MAX_BLOCKS);
  paddedHeights.set(heights);
  device.queue.writeBuffer(buffers.heightBuffer, 0, paddedHeights);

  const paddedBaseY = new Float32Array(MAX_BLOCKS);
  paddedBaseY.set(baseY);
  device.queue.writeBuffer(buffers.baseYBuffer, 0, paddedBaseY);
}

interface PipelineOptions {
  vertex:       string;
  fragment:     string;
  depthWrite:   boolean;
  depthCompare: GPUCompareFunction;
  blend?:       GPUBlendState;
}

function makePipeline(
  device:         GPUDevice,
  format:         GPUTextureFormat,
  bindGroupLayout: GPUBindGroupLayout,
  opts:           PipelineOptions,
): GPURenderPipeline {
  const defaultBlend: GPUBlendState = {
    color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
  };

  return device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    vertex: {
      module:     device.createShaderModule({ code: opts.vertex }),
      entryPoint: 'main',
    },
    fragment: {
      module:     device.createShaderModule({ code: opts.fragment }),
      entryPoint: 'main',
      targets:    [{ format, blend: opts.blend ?? defaultBlend }],
    },
    primitive:    { topology: 'triangle-list', cullMode: 'none' },
    depthStencil: {
      depthWriteEnabled: opts.depthWrite,
      depthCompare:      opts.depthCompare,
      format:            'depth24plus',
    },
  });
}
