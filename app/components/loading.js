export default function Loading() {
  return (
    <div className="w-5/6 md:w-3/6 h-[30vh] mt-3 bg-transparent p-2 relative rounded-lg grid items-center justify-items-center z-0">
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
