import Link from "next/link";
import Search from "./search";
import { Suspense } from "react";

export default function Nav() {
  return (

<div className="relative z-10 -skew-x-[30deg] font-bold italic bg-blue-900 w-[90vw] h-[6vh] md:h-[8vh] flex items-center m-auto justify-between pr-8">
    <div className="bg-blue-500 text-sm md:text-xl text-zinc-300 h-full w-[30%] md:w-1/5 flex gap-1 items-center justify-center md:gap-2">
    <Link href="/" className="font-bold text-xl md:text-2xl italic text-zinc-800 skew-x-[30deg]">
            BlueAero
          </Link>
    </div>
    <div className="relative flex gap-2 items-center justify-items-center w-[63%] md:w-[25%] h-[40%] md:h-[61%] mr-2">
      <Suspense fallback={<p>Loading Search...</p>}>
        <Search />
      </Suspense>
    </div>
    </div>
  );
}
