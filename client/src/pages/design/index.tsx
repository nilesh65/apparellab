import { Spinner } from "@/components/ui/spinner"
import { CanvasProvider } from "@/context/canvas-context"
import { getProductTemplateById } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import CanvasEditor from "./component/canvas-editor"
import EditorSidebar from "./component/editor-sidebar"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
const DesignPage = () => {
  const { product_id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ["design", product_id],
    queryFn: async () => {
      const response = await getProductTemplateById(product_id!);
      return response
    }
  })
  const template = data?.template ?? null;
  const colors = data?.colors;
  const basePrice = data?.template?.basePrice ?? 0


  if (isLoading) {
    return <div className="flex flex-col h-[75vh] w-full items-center justify-center">
      <Spinner className="size-12" />
      <p className="text-sm text-muted-foreground">Loading Design Editor...</p>
    </div>
  }

  if (!template) {
    return <div className="flex flex-col h-screen w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Template not found</p>
    </div>
  }

  return (
    <CanvasProvider
      basePrice={basePrice}
    >
      <div className="flex w-full h-[calc(100vh-48px)] overflow-hidden">
        <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 border-t border-r overflow-y-auto flex-col">
          <EditorSidebar
            templateId={template._id}
            basePrice={basePrice}
            colors={colors ?? []}
          />
        </aside>
        <div className="flex-1 relative">
  <CanvasEditor
    template={template}
    defaultColor={colors?.[0]}
  />

  {/* Mobile Edit Button */}
  <div className="lg:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-40">
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="rounded-full shadow-lg gap-2 px-4">
          <SlidersHorizontal className="w-4 h-4" />
          Edit Design
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0 overflow-y-auto rounded-t-2xl">
        <EditorSidebar
          templateId={template._id}
          basePrice={basePrice}
          colors={colors ?? []}
        />
      </SheetContent>
    </Sheet>
  </div>
</div>

      </div>
    </CanvasProvider>
  )
}

export default DesignPage
