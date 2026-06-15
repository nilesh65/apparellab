import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { createOrderSession } from "@/lib/api";
import { toast } from "sonner";



const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(1, "Full name is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type CheckoutFormType = z.infer<typeof checkoutSchema>;

const customerFields = [
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "name", label: "Full name", placeholder: "John Doe" },
];

const shippingFields = [
  { name: "street", label: "Street Address", placeholder: "123 Main St" },
  { name: "city", label: "City", placeholder: "New York" },
  { name: "state", label: "State", placeholder: "NY" },
  { name: "postal", label: "Postal Code", placeholder: "100001" },
  { name: "country", label: "Country", placeholder: "US" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+1" },
];

type CheckoutDialogProps = {
  listing: any;
  selectedSize: string;
  selectedColor: {
    _id: string;
    mockupImageUrl: string;
    name: string;
    color: string;
  };
}

const CheckoutDialog = ({ listing, selectedSize, selectedColor }: CheckoutDialogProps) => {
  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      name: "",
      street: "",
      city: "",
      state: "",
      postal: "",
      country: "",
      phone: ""
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrderSession,
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: () => {
      toast.error("Failed to create checkout session. Please try again.");
    }
  })




  const onSubmit = async (data: CheckoutFormType) => {
    mutate({
      listingId: listing._id,
      colorId: selectedColor._id,
      size: selectedSize,
      customerEmail: data.email,
      customerName: data.name,
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postal,
        country: data.country,
        phoneNumber: data.phone,
      },
    })
  };

  const renderField = ({ name, label, type, placeholder }: typeof customerFields[0]) => (
    <FormField
      key={name}
      control={form.control}
      name={name as keyof CheckoutFormType}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type ?? "text"} placeholder={placeholder} {...field}
              className='py-4'
            // autoComplete='off'
            // autoCorrect='off'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-14 text-lg font-bold rounded-xl">Buy now</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-background p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2!">
          <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[72vh] overflow-y-auto px-6">
              <div className="space-y-4 px-1">
                {/* Product Summary */}
                <div className="flex gap-4 bg-muted p-3 rounded-lg border">
                  <div className="h-16 w-16 bg-background rounded border shrink-0">
                    {selectedColor && (
                      <img
                        src={selectedColor.mockupImageUrl}
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>
                    <p className="text-sm font-semibold mt-1">${listing.sellingPrice}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[10px] text-white">1</span>
                  <h3 className="font-semibold text-sm uppercase tracking-tight">Customer Details</h3>
                </div>
                {customerFields.map(renderField)}

                <Separator />

                {/* Shipping Address */}
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[10px] text-white">2</span>
                  <h3 className="font-semibold text-sm uppercase tracking-tight">Shipping Address</h3>
                </div>
                <div className="pb-4 space-y-4">
                  {shippingFields.map(renderField)}
                </div>

              </div>
            </ScrollArea>

            <div className="p-6 border-t">
              <Button type="submit" className="w-full h-12 font-bold"
                disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Processing..." : `Pay $${listing.sellingPrice}`}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3">
                By clicking, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
