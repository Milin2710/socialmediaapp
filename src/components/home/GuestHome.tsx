"use client";
import Link from "next/link";

const GuestHome = () => {
  return (
    <div className="text-center p-8">
      <p className="text-3xl font-bold">
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
        &nbsp; to see feeds
      </p>
    </div>
  );
};

export default GuestHome;
