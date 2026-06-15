import { PROTECTED_ROUTES } from "@/routes/routes"
import { Link } from "react-router-dom"
import { FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

const Logo = ({ isCollapsed = false, className }: { isCollapsed?: boolean, className?: string }) => {
    return (
        <Link
            to={PROTECTED_ROUTES.HOME}
            className={cn("flex items-center gap-2 group transition-all shrink-0 select-none", className)}>
            <div className={`flex items-center justify-center ${isCollapsed?"w-12 h-6":"w-8 h-8"} rounded-xl bg-linear-to-tr from-primary to-primary/80 text-primary-foreground shadow-sm group-hover:shadow-md group-hover:scale-120 transition-all duration-300`}>
                <FlaskConical className="w-4 h-4 shrink-0" />
            </div>
            <span className={cn(`text-xl font-bold tracking-tight text-foreground`,
                isCollapsed ? "hidden" : "block",
                className
            )}>
                ApparelLab
            </span>
        </Link>
    )
}

export default Logo