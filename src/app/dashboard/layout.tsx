import { NavBar } from "@/components/navbar/navbar";
export default async function DahboarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavBar />
            {children}

        </>
    );
}
