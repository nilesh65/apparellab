import { Canvas, controlsUtils, Control, util, TPointerEvent, Transform } from "fabric";

function renderSvgIcon(svgString: string) {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  return function (ctx: CanvasRenderingContext2D, left: number, top: number, _: unknown, fabricObject: any) {
    const size = 26;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(fabricObject.angle ?? 0));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

const deleteIcon = renderSvgIcon(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#08080D"/><path d="M7.79688 9.54987H16.1969" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.84375 9.54987H15.1438V15.8499C15.1438 16.0355 15.07 16.2136 14.9388 16.3449C14.8075 16.4761 14.6294 16.5499 14.4438 16.5499H9.54375C9.3581 16.5499 9.18005 16.4761 9.04877 16.3449C8.9175 16.2136 8.84375 16.0355 8.84375 15.8499V9.54987Z" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.25 9.5499V9.1999C10.25 8.73577 10.4344 8.29064 10.7626 7.96245C11.0908 7.63427 11.5359 7.44989 12 7.44989C12.4641 7.44989 12.9093 7.63427 13.2375 7.96245C13.5656 8.29064 13.75 8.73577 13.75 9.1999V9.5499" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.9453 11.6511V14.4522" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.0469 11.6511V14.4522" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const rotateIcon = renderSvgIcon(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#08080D"/><path d="M9.03906 15.0991C9.43177 15.5027 9.90051 15.8318 10.4222 16.0635" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.2266 16.4439C12.8097 16.4439 13.3665 16.3316 13.8767 16.1274" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.3594 15.1486C15.7356 14.7736 16.0451 14.3318 16.2683 13.8423" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.79688 12.388C7.82988 12.7697 7.91113 13.1376 8.0345 13.4855" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.6678 12.0002C16.6678 9.54579 14.6781 7.55609 12.2237 7.55609C10.5738 7.55609 9.13391 8.4551 8.36719 9.78998" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.01562 8.02014L8.36099 9.79763L10.1578 9.68304" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const scaleIcon = renderSvgIcon(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="12" fill="#08080D"/><path d="M10.5184 10.5231L7.19531 7.20001" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.1492 7.20001H7.19531V10.1539" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.4766 13.4769L16.7996 16.8" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.8438 16.8001H16.7976V13.8463" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.212 9.78455L9.78125 14.2153" stroke="white" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

function deleteHandler(_: TPointerEvent, transform: Transform) {
  const target = transform.target;
  const canvas = target.canvas as Canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
  return true;
}

export function applyCustomControls(canvas: Canvas) {
  canvas.on("object:added", (e) => {
    const obj = e.target;
    if (!obj) return;

    obj.setControlsVisibility({
      ml: false, mr: false, mt: false, mb: false,
      tl: false, tr: false, bl: false, br: false, mtr: false,
    });

    obj.controls.deleteControl = new Control({
      x: -0.5, y: -0.5, offsetX: -2, offsetY: -2,
      cursorStyle: "pointer",
      mouseUpHandler: deleteHandler,
      render: deleteIcon,
      sizeX: 24, sizeY: 24,
    });

    obj.controls.rotateControl = new Control({
      x: 0.5, y: -0.5, offsetX: 2, offsetY: -2,
      cursorStyle: "crosshair",
      actionHandler: controlsUtils.rotationWithSnapping,
      actionName: "rotate",
      render: rotateIcon,
      sizeX: 24, sizeY: 24,
    });

    obj.controls.scaleControl = new Control({
      x: 0.5, y: 0.5, offsetX: 2, offsetY: 2,
      cursorStyle: "nwse-resize",
      actionHandler: controlsUtils.scalingEqually,
      actionName: "scale",
      render: scaleIcon,
      sizeX: 24, sizeY: 24,
    });
  });
}