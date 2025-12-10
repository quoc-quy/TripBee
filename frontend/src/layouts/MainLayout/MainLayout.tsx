import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

interface Props {
    children?: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <div>
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
        </div>
    );
}
