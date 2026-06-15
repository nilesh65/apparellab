import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListingQueryFn, deleteListingFn } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link2, Trash2 } from "lucide-react";
import { ENV } from "@/lib/env";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const ListingsPage = () => {
  const { data: listingData, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: getListingQueryFn,
  });

  const listings = listingData?.listings ?? [];
  const queryClient = useQueryClient();
  const { mutate: deleteListing } = useMutation({
    mutationFn: deleteListingFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
    },
  });
  console.log("FIRST LISTING:", listings[0]);
  console.log("COLOR IDS:", listings[0]?.colorIds);
  return (
    <div className="min-h-screen w-full">
    <div className="max-w-5xl w-full mx-auto px-4 py-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your active listings.
          </p>
        </div>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={3}>
                      <div className="h-10 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : listings.map((listing: any) => (
                  <TableRow key={listing._id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="border rounded-sm pt-2 px-2">
                        <img
                          src={`${ENV.BASE_API_URL}/api/listing/mockup/${listing.slug}/${listing.colorIds[0]?.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                          alt={listing.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                      <div>
                        <h5 className=" font-medium">{listing.title}</h5>
                        <p className="max-w-[300px] mt-px text-muted-foreground text-xs w-full truncate">
                          {listing.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>${listing.sellingPrice}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this listing?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Listings with
                                existing orders will be archived automatically.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteListing(listing._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button size="sm" variant="outline" asChild>
                          <a href={`/listing/${listing.slug}`} target="_blank">
                            <Link2 className="w-4 h-4 mr-1" /> Share Link
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
