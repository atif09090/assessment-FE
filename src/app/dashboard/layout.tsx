import { NavBar } from "@/components/navbar/navbar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function DahboarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('next-auth.csrf-token');

    if (!token) {
        redirect('/');
    }

    return (
        <>
            <NavBar />
            {children}

        </>
    );
}
