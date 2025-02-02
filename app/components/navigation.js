import Link from "next/link";
import Search from "./search";
import { Suspense } from "react";

export default function Nav() {
  return (
    <div className="w-full h-[5.5vh] md:h-[6.5vh] bg-blue-900 flex justify-between px-2 items-center">
      <Link href="/" className="font-bold text-2xl italic text-neutral-300">
        BlueAero
      </Link>

      <Suspense fallback={<p>Loading Search...</p>}>
        <Search />
      </Suspense>
    </div>
  );
}
