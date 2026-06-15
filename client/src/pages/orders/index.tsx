import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/lib/api";
import { GetUserOrdersResponse } from "@/types/order";
import { ENV } from "@/lib/env";
const OrdersPage = () => {
  const { data, isLoading } = useQuery<GetUserOrdersResponse>({
    queryKey: ["orders"],
    queryFn: getUserOrders,
  });

  const orders = data?.orders ?? [];

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl w-full mx-auto px-4 py-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Orders placed for your listings.</p>
        </div>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="flex items-center gap-3">
                  <div className="border rounded-sm pt-2 px-2">
                    <img
                      src={`${ENV.BASE_API_URL}/api/listing/mockup/${order.listingId?.slug}/${order.colorId?.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                      alt={order.listingId?.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium">{order.listingId?.title}</h5>
                    <p className="text-xs text-muted-foreground">{order.colorId?.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </TableCell>
                <TableCell>{order.size}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: order.colorId?.color }} />
                    <p>{order.colorId?.name}</p>
                  </div>
                </TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      order.status === "pending" && "bg-yellow-500",
                      order.status === "awaiting_shipment" && "bg-green-400",
                      order.status === "shipped" && "bg-blue-400",
                      order.status === "fulfilled" && "bg-purple-400",
                      order.status === "failed" && "bg-red-400",

                    )}
                  >
                    {order?.status?.replaceAll("_", " ")}
                  </Badge>
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

export default OrdersPage;
