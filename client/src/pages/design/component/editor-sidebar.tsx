import { useState, useEffect } from "react";
import { FabricImage, IText } from "fabric";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ListingDataKey, useCanvas } from "@/context/canvas-context";
import { cn } from "@/lib/utils";
import { ProductColorType } from "@/types/product";
import {
  BoldIcon,
  Check,
  DollarSign,
  ImageIcon,
  ItalicIcon,
  Sparkles,
  Type,
  UnderlineIcon,
  Wand2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CreateListingType } from "@/types/listing";
import { createListingMutationFn, generateArtworkMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import art1 from "@/assets/artworks/art-1.png";
import art2 from "@/assets/artworks/art-2.png";
import art3 from "@/assets/artworks/art-3.png";
import art4 from "@/assets/artworks/art-4.png";
import art5 from "@/assets/artworks/art-5.png";
import art6 from "@/assets/artworks/art-6.png";
import art7 from "@/assets/artworks/art-7.png";
import art8 from "@/assets/artworks/art-8.png";
import art9 from "@/assets/artworks/art-9.png";
import art10 from "@/assets/artworks/art-10.png";

const ARTWORK_PRESET = [
  art1,
  art2,
  art3,
  art4,
  art5,
  art6,
  art7,
  art8,
  art9,
  art10,
];

const EditorSidebar = ({
  colors,
  templateId,
  basePrice,
}: {
  colors: ProductColorType[];
  basePrice: number;
  templateId: string;
}) => {
  const navigate = useNavigate();
  const { canvasEditor, updatedListingState, listingData } = useCanvas();
  const [activeTextObj, setActiveTextObj] = useState<IText | null>(null);
  const [textProps, setTextProps] = useState({
    fill: "#000000",
    fontFamily: "Helvetica",
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
  });
  const [openPopover, setOpenPopover] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: async (data: CreateListingType) => {
      const res = await createListingMutationFn(data);
      return res;
    },
  });

  const { mutate: generateArtwork, isPending: isGenerating } = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await generateArtworkMutationFn(prompt);
      return res;
    },
  });

  useEffect(() => {
    if (!canvasEditor) return;
    const onSelect = (e: any) => {
      const obj = e.selected?.[0];
      setActiveTextObj(obj);
      if (obj?.type === "i-text") {
        setTextProps({
          fill: obj.fill as string,
          fontFamily: obj.fontFamily,
          fontWeight: obj.fontWeight as string,
          underline: obj.underline ?? false,
          fontStyle: obj.fontStyle,
        });
      } else {
        setActiveTextObj(null);
      }
    };

    const onClear = () => setActiveTextObj(null);
    canvasEditor.on("selection:created", onSelect);
    canvasEditor.on("selection:updated", onSelect);
    canvasEditor.on("selection:cleared", onClear);
    return () => {
      canvasEditor.off("selection:created", onSelect);
      canvasEditor.off("selection:updated", onSelect);
      canvasEditor.off("selection:cleared", onClear);
    };
  }, [canvasEditor]);

  const addImageToCanvas = async (url: string) => {
    if (!canvasEditor) return;
    const img = await FabricImage.fromURL(url, {
      crossOrigin: "anonymous",
    });
    img.scaleToWidth(canvasEditor.getWidth() * 0.75);
    canvasEditor.add(img);
    canvasEditor.centerObject(img);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    await addImageToCanvas(url);
    e.target.value = "";
  };

  const addText = () => {
    if (!canvasEditor) return;
    const text = new IText("TEXT", {
      left: 120,
      top: 100,
      fontSize: 40,
      fontFamily: "Helvetica",
      fontWeight: "normal",
      fill: "#000000",
    });
    canvasEditor.add(text);
    canvasEditor.setActiveObject(text);
  };

  const updateText = (args: Partial<typeof textProps>) => {
    activeTextObj?.set(args as any);
    canvasEditor?.requestRenderAll();
    setTextProps((prev) => ({ ...prev, ...args }));
  };

  const handleChange = (key: ListingDataKey, value: string) => {
    updatedListingState(key, value);
  };

  const handleColorChange = (color: ProductColorType) => {
    const coloredList = listingData.selectedColors || [];
    const isSelected = coloredList.some((c) => c._id === color._id);
    let newColors;
    if (isSelected) {
      newColors = coloredList.filter((c) => c._id !== color._id);
    } else {
      if (coloredList.length >= 4) return; // End interaction if limit reached
      newColors = [...coloredList, color];
    }
    updatedListingState("selectedColors", newColors);
  };

  const handlePresetArtwork = async (art: string) => {
    await addImageToCanvas(art);
    setOpenPopover(false);
  };

  const isFormValid = () => {
    return (
      listingData.title.trim() !== "" &&
      listingData.description.trim() !== "" &&
      listingData.sellingPrice >= (basePrice || 0) &&
      listingData.selectedColors.length > 0 &&
      canvasEditor !== null
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast.error("Please fill all fields");
      return;
    }
    const payload = {
      templateId: templateId,
      title: listingData.title,
      description: listingData.description,
      sellingPrice: parseFloat(Number(listingData.sellingPrice).toFixed(2)),
      colorIds: listingData.selectedColors.map((color) => color._id),
      artworkUrl: listingData.artworkUrl,
      artworkPlacement: listingData.artworkPlacement,
    };
    createListing(payload, {
      onSuccess: () => {
        toast.success("Listing created successfully");
        navigate(PROTECTED_ROUTES.LISTINGS);
      },
      onError: () => {
        toast.error("Failed to submit listing");
      },
    });
  };

  const handleAIArtwork = async () => {
    if (isGenerating) return;
    generateArtwork(userPrompt, {
      onSuccess: async (data) => {
        await addImageToCanvas(data.artworkUrl);
        setOpenPopover(false);
      },
      onError: () => {
        toast.error("Failed to generate artwork");
      },
    });
  };

  return (
    <div className="flex flex-col bg-background h-full overflow-hidden">
      <div className="flex-1 py-2 space-y-2 divide-y divide-border overflow-y-auto">
        <section className="space-y-2 pb-3 px-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Design your product
            </h2>
            <p className="text-xs text-muted-foreground">Max file size 50MB</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolButton
              icon={<ImageIcon />}
              label="Add Image"
              isUpload
              disabled={isPending}
              onChange={handleImageUpload}
            />
            <ToolButton
              icon={<Type />}
              label="Add Text"
              disabled={isPending}
              onClick={addText}
            />

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <ToolButton
                  icon={<Wand2 />}
                  label="AI Art Studio"
                  disabled={isPending}
                  className="flex-1 bg-primary/10 border-primary/20 text-primary! hover:bg-primary/20"
                />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="right"
                className="w-[320px] sm:w-100 p-0 shadow-2xl
                border-border rounded-xl overflow-hidden
                "
              >
                <div className="p-4 space-y-4 bg-background">
                  <div
                    className="flex justify-between items-center
                  border-b pb-3
                  "
                  >
                    <h3 className="text-sm text-foreground">
                      Describe your design or pick an artwork
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={userPrompt}
                      className="resize-none flex-1 min-h-10"
                      placeholder="e.g. Stay Wild quote, A cool gamer freak dog..."
                      onChange={(e) => setUserPrompt(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={isGenerating}
                      onClick={handleAIArtwork}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner />
                          <span className="leading-tight">
                            Generating... (~30s)
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Generate</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[10px] font-semibold text-muted-foreground uppercase">
                      Quick Artworks
                    </h5>

                    <div
                      className="grid grid-cols-5 gap-2
                    max-h-45 overflow-y-auto
                    "
                    >
                      {ARTWORK_PRESET.map((art, i) => (
                        <button
                          key={i}
                          className="rounded-md border border-border
              bg-white hover:border-primary hover:ring-2 hover:ring-primary/20
              overflow-hidden p-1 shadow-sm"
                          onClick={() => handlePresetArtwork(art)}
                        >
                          <img
                            src={art}
                            alt="style"
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {activeTextObj && (
            <div className="flex items-center gap-2 pt-1">
              <select
                className="flex-[0.5] text-sm border
                border-border rounded-md px-2 py-1.5
                 bg-background"
                value={textProps.fontFamily}
                disabled={isPending}
                onChange={(e) => {
                  updateText({
                    fontFamily: e.target.value,
                  });
                }}
              >
                {[
                  "Helvetica",
                  "Impact",
                  "Arial",
                  "Georgia",
                  "Times New Roman",
                  "Courier New",
                ].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <ToggleGroup
                type="multiple"
                orientation="horizontal"
                spacing={1}
                value={[
                  ...(textProps.fontWeight === "bold" ? ["bold"] : []),
                  ...(textProps.fontStyle === "italic" ? ["italic"] : []),
                  ...(textProps.underline ? ["underline"] : []),
                ]}
                onValueChange={(vals) => {
                  const props = {
                    fontWeight: vals.includes("bold") ? "bold" : "normal",
                    fontStyle: vals.includes("italic") ? "italic" : "normal",
                    underline: vals.includes("underline"),
                  };
                  updateText(props);
                }}
              >
                <ToggleGroupItem value="bold">
                  <BoldIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  <ItalicIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline">
                  <UnderlineIcon />
                </ToggleGroupItem>
              </ToggleGroup>
              <input
                type="color"
                className="w-8 h-8 rounded-lg!
                cursor-pointer overflow-hidden"
                value={textProps.fill}
                onChange={(e) => updateText({ fill: e.target.value })}
              />
            </div>
          )}
        </section>

        <section className="space-y-2 pb-3 px-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Choose product colors
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select up to 4 backgrounds
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors?.map((item) => {
              const isSelected = (listingData.selectedColors || []).some(
                (c) => c._id === item._id,
              );
              const isWhite = item.color.trim() === "rgb(255, 255, 255)";

              return (
                <button
                  key={item.name}
                  onClick={() => handleColorChange(item)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2",
                    isWhite && "border-border",
                  )}
                  disabled={isPending}
                  style={{ backgroundColor: item.color }}
                >
                  {isSelected && (
                    <Check
                      className={cn(
                        "w-4 h-4",
                        isWhite ? "text-black" : "text-white",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2 pb-3 px-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Set your pricing
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set your pricing
            </p>
          </div>
          <div>
            <InputGroup className="py-3!">
              <InputGroupAddon>
                <DollarSign size={28} />
              </InputGroupAddon>
              <InputGroupInput
                className={cn(
                  "text-base!",
                  listingData.sellingPrice < basePrice && "border-destructive",
                )}
                placeholder="Selling Price"
                type="number"
                value={listingData.sellingPrice}
                disabled={isPending}
                onChange={(e) => handleChange("sellingPrice", e.target.value)}
              />
            </InputGroup>
            {listingData.sellingPrice < basePrice && (
              <p className="text-xs text-destructive mt-1">
                Price must be at least ${basePrice}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-2 pb-3 px-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Title & Description
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Title and description
            </p>
          </div>
          <div className="space-y-2">
            <Input
              className="text-sm! py-3!"
              placeholder="Title"
              type="text"
              value={listingData.title}
              disabled={isPending}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Textarea
              className="text-sm! h-20!"
              placeholder="Description"
              value={listingData.description}
              disabled={isPending}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </section>
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0">
        <Button
          size="lg"
          className="w-full cursor-pointer py-4"
          disabled={!isFormValid() || isPending}
          onClick={handleSubmit}
        >
          {isPending ? <Spinner className="size-6" /> : "Create Product"}
        </Button>
      </div>
    </div>
  );
};

const ToolButton = ({
  icon,
  label,
  className,
  isUpload,
  onClick,
  onChange,
  ref,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  isUpload?: boolean;
  className?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLButtonElement>;
  [key: string]: any;
}) => {
  const buttonClass = cn(
    `flex-1 min-w-[30%] flex flex-col items-center
    gap-1 px-2 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors
    `,
    className,
  );
  const content = (
    <>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </>
  );

  if (isUpload) {
    return (
      <label className={cn(buttonClass, "cursor-pointer")}>
        {content}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    );
  }

  return (
    <button ref={ref} onClick={onClick} className={buttonClass} {...props}>
      {content}
    </button>
  );
};

export default EditorSidebar;
