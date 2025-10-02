export function Footer() {
  return (
    <footer className="bg-[#f2f4f6] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a1a]">
            Let's Talk
          </h2>

          <a
            href="mailto:youremail@domain.com"
            className="text-lg text-foreground hover:text-muted-foreground transition-colors block"
          >
            youremail@domain.com
          </a>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              ©2024{" "}
              <span className="font-semibold text-foreground">bentoMan</span>.
              All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
