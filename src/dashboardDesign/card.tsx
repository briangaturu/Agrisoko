import React, { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) =>  {
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-green-200 p-4 md:p-6 max-w-full min-h-[calc(100vh-3rem)]">
            {children}
        </div>
    )
}

export default Card