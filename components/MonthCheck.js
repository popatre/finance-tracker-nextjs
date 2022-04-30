import { useRouter } from "next/router";

export default function DateCheck({ children }) {
    const router = useRouter();
    const { year } = router.query;

    return year ? children : null;
}
