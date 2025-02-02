export default function LoadingForecast() {
  return (
    <div className="grid items-center justify-items-center fixed w-[90vw] top-[8vh] md:w-[60vw] h-[80vh] md:h-[80vh] left-[5vw] md:left-[20vw] bg-neutral-800 z-10 rounded-lg overflow-auto p-4 gap-4">
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
