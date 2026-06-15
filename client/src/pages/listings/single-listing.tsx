import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Ruler, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListingBySlugQueryFn } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Logo from '@/components/logo';
import CheckoutDialog from './components/checkout-dialog';
import { ListingSingleType } from '@/types/listing';

const SingleListingPage = () => {
  const { slug } = useParams();
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["listing", slug],
    queryFn: () => getListingBySlugQueryFn(slug!),
    enabled: !!slug,
  });

  const listing = data?.listing as ListingSingleType;

  useEffect(() => {
    if (listing?.colorIds?.length) setSelectedColor(listing.colorIds[0]);
  }, [listing]);



  if (isLoading) return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-[500px] aspect-[5/6] rounded-2xl" />
        <div className="flex-1 max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen w-full">
      <header className='w-full bg-white dark:bg-black/80 shadow-sm h-14 mb-2'>
        <div className='w-full max-w-7xl mx-auto p-2.5'>
          <Logo />
        </div>
      </header>
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-center gap-8">

          {/* Media Gallery */}
          <div className="w-full md:w-[500px] space-y-4">
            <div className="aspect-[6/6] bg-muted rounded-2xl overflow-hidden border">
              {selectedColor && (
                <img
                  src={selectedColor.mockupImageUrl}
                  alt={listing.title}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Color thumbnails */}
            <div className="flex justify-center gap-3">
              {listing.colorIds.map((color: any) => (
                <button
                  key={color._id}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-20 h-20 rounded-lg border-2 overflow-hidden transition-all bg-muted",
                    selectedColor?._id === color._id ? "border-primary" : "border-transparent"
                  )}
                >
                  <img
                    src={color.mockupImageUrl}
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                    decoding="async"
                    alt={color.name}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 max-w-md flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-medium">{listing.title}</h1>
                <p className="text-muted-foreground">{listing.templateName}</p>
              </div>
              <span className="text-2xl font-bold">${listing.sellingPrice}</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Color: {selectedColor?.name}
                </span>
                <div className="flex gap-2">
                  {listing.colorIds.map((color: any) => (
                    <button
                      key={color._id}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={cn(
                        "w-8 h-8 rounded-full border-2  transition-all",
                        selectedColor?._id === color._id ? "border-primary" : "border-border"
                      )}
                      style={{ backgroundColor: color.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Size</span>
                  <Button variant="ghost" size="sm" className="text-slate-500 h-auto p-0 gap-1 hover:bg-transparent">
                    <Ruler className="w-4 h-4" /> Size guide
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {listing.sizes?.map((size: string) => (
                    <Button
                      key={size}
                      variant="outline"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 font-medium transition-all",
                        selectedSize === size ? "border-primary text-primary" : "border-border"
                      )}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CheckoutDialog
                listing={listing}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
              />
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium py-2">
                <ShieldCheck className="w-4 h-4" />
                10 Day Returns No question asked.
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full border-t">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm text-muted-foreground">Description</AccordionTrigger>
                <AccordionContent className="text-sm">{listing.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger className="text-sm text-muted-foreground">Additional Details</AccordionTrigger>
                <AccordionContent className="text-sm">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>1 year manufacturer warranty.</li>
                    <li>Manufactured in Noida, India.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm text-muted-foreground">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm">Delivered within 7 business days.</AccordionContent>
              </AccordionItem>
            </Accordion>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListingPage;