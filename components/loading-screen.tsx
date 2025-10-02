"use client";

export function LoadingScreen() {
  const letters = "LOADING".split("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f7f9]">
      <div className="flex items-center gap-8">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="text-2xl font-extralight tracking-widest text-muted-foreground animate-pulse"
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "1.5s",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
