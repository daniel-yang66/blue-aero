export default function LoadingForecast() {
  return (
    <div className="w-[96vw] md:w-[65vw] h-full bg-zinc-800 p-2 absolute top-0 left-0 rounded-lg grid items-center justify-items-center z-10 overflow-auto text-zinc-300 overflow-auto">
      <img
        src="/fan.png"
        className="spin"
        width="140"
        height="140"
        alt="turbofan engine"
      />
    </div>
  );
}
