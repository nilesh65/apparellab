import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getListingQueryFn, getProducts } from "@/lib/api";
import { Link } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { Skeleton } from "@/components/ui/skeleton";
import bannerImage from "@/assets/banner.png";
import { ENV } from "@/lib/env";

const HomePage = () => {
  const { data: productData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: listingData, isLoading: isLoadingListings } = useQuery({
    queryKey: ["listings"],
    queryFn: getListingQueryFn,
  });

  const listings = listingData?.listings ?? [];

  const catalogProducts = productData?.products?.catalog || [];
  const featuredProducts = productData?.products?.featured || [];

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto px-4">
        {/* --- Hero / Banner Section --- */}
        <section className="bg-muted overflow-hidden mb-5">
          <div className="overflow-hidden rounded-xl">
            <img
              src={bannerImage}
              alt="Banner"
              className="w-full aspect-[4/1.1] object-cover"
            />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Starter Base</h2>
              <p className="text-sm text-muted-foreground">
                Select a base and then create your dream design.
              </p>
            </div>
          </div>

          {/* Large Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {" "}
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-xl"
                  />
                ))
              : catalogProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="border-none shadow-lg p-0 rounded-xl overflow-hidden"
                  >
                    <Link
                      to={PROTECTED_ROUTES.DESIGN.replace(
                        ":product_id",
                        product._id,
                      )}
                      className="relative h-full  overflow-hidden rounded-xl"
                    >
                      <img
                        src={product.displayUrl}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </Card>
                ))}
          </div>

          {/* Small Card Grid */}
          <div>
            <h2 className="text-2xl font-bold">Visual Examples</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-xl"
                  />
                ))
              : featuredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="border-none! shadow-sm p-0 rounded-lg group cursor-pointer overflow-hidden"
                  >
                    <Link
                      to={PROTECTED_ROUTES.DESIGN.replace(
                        ":product_id",
                        product._id,
                      )}
                    >
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={product.displayUrl}
                          alt={product.name}
                          className="object-cover object-top w-full h-full group-hover:opacity-90"
                        />
                      </div>
                      <div className="px-4 py-2">
                        <h3 className="text-base font-medium truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {product.body}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6 mt-4">
            <div>
              <h2 className="text-2xl font-bold">Recently Created</h2>
              <p className="text-sm text-muted-foreground">
                Manage your active listings and track their performance.
              </p>
            </div>
            <Link
              to={PROTECTED_ROUTES.LISTINGS}
              className="text-sm font-medium underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {isLoadingListings ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square w-full rounded-xl"
                />
              ))
            ) : listings?.length === 0 ? (
              <p>No listings found</p>
            ) : (
              listings.slice(0, 8).map((listing: any) => (
                <Card
                  key={listing._id}
                  className="border-none! shadow-sm p-0
                            rounded-lg group cursor-pointer overflow-hidden"
                >
                  <a href={`/listing/${listing.slug}`} target="_blank">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={`${ENV.BASE_API_URL}/api/listing/mockup/${listing.slug}/${listing.colorIds[0]?.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                        alt={listing.title}
                        className="object-contain w-full h-full  group-hover:opacity-90"
                        fetchPriority="high"
                        decoding="async"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = listing.artworkUrl;
                        }}
                      />
                    </div>
                    <div className="px-3 py-3 space-y-1">
                      <h3 className="text-sm font-medium truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground">
                        Sale price ${listing.sellingPrice}
                      </p>
                      <div className="flex gap-1">
                        {listing.colorIds?.map((color: any) => (
                          <div
                            key={color._id}
                            className="size-4 rounded-full border"
                            style={{ backgroundColor: color.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </a>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
