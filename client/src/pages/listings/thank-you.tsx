import Logo from "@/components/logo";
import { CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ThankYouPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/orders"); // ya tumhara PROTECTED_ROUTES.ORDERS
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen w-full flex flex-col">
            <header className='w-full bg-white dark:bg-black/80 shadow-sm h-14 mb-2'>
                <div className='w-full max-w-7xl mx-auto p-2.5'>
                    <Logo />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md px-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold">Order Confirmed!</h1>

                    <p className="text-muted-foreground">
                        Thank you for your purchase.
                    </p>

                    {orderId && (
                        <p className="text-xs text-muted-foreground">
                            Order ID: <span className="font-mono">{orderId}</span>
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ThankYouPage;