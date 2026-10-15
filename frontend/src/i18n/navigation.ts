/* Dùng Link của intl để tự động xử lý locale (vi, en) trong url */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const {
    Link,
    redirect,
    usePathname,
    useRouter,
    getPathname,
} = createNavigation(routing)